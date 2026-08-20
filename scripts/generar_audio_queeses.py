#!/usr/bin/env python3
"""Genera public/audio_queeses.wav para la intro IntroQueEs (4.0s, 48kHz estéreo).

Todo el audio se sintetiza con numpy/scipy — no se descarga ni referencia
ningún archivo externo. Misma técnica que scripts/generar_audio.py,
adaptada a la línea de tiempo de 4 segundos de "¿QUÉ ES INPROC?":

  0.0-1.0s   zumbido grave (55Hz + 110Hz), fade-in, volumen bajo
  1.0-3.3s   se suma una capa a 220Hz + ruido rosa filtrado muy tenue,
             ambos con una rampa ascendente de volumen lenta
  3.3-3.7s   riser corto: barrido de frecuencia ascendente
  3.7-4.0s   golpe grave (sub-bass) con decaimiento rápido que cierra

El resultado se normaliza a ~-14 LUFS integrado (ITU-R BS.1770) sin clipping.
"""

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DURATION = 4.0
N = int(round(SR * DURATION))
t = np.arange(N) / SR

OUT_PATH = "public/audio_queeses.wav"
TARGET_LUFS = -14.0
PEAK_CEILING = 10 ** (-0.3 / 20)  # ~-0.3 dBFS safety margin, never clip

rng = np.random.default_rng(20240912)


def smoothstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)


def envelope(t, points):
    """Piecewise smoothstep envelope through (time, value) points.

    Holds the first value before the first point and the last value after
    the last point; smoothsteps linearly-in-time between consecutive points.
    """
    out = np.full_like(t, points[0][1], dtype=float)
    for (t0, v0), (t1, v1) in zip(points[:-1], points[1:]):
        mask = (t >= t0) & (t <= t1)
        local = smoothstep((t[mask] - t0) / (t1 - t0))
        out[mask] = v0 + (v1 - v0) * local
    out[t > points[-1][0]] = points[-1][1]
    return out


def pink_noise(n):
    """Paul Kellet's economy pink-noise IIR filter applied to white noise."""
    white = rng.standard_normal(n)
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1.0, -2.494956002, 2.017265875, -0.522189400]
    pink = signal.lfilter(b, a, white)
    return pink / (np.max(np.abs(pink)) + 1e-9)


def k_weighted_mean_square(x, sr):
    """Per-channel mean square after ITU-R BS.1770 K-weighting (48kHz coeffs)."""
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    stage1 = signal.lfilter(b1, a1, x)
    stage2 = signal.lfilter(b2, a2, stage1)
    return np.mean(stage2 ** 2)


# --- Capa 1: zumbido grave 55Hz + 110Hz ------------------------------------
hum_env = envelope(t, [(0.0, 0.0), (1.0, 0.16), (3.3, 0.28), (3.5, 0.10), (3.75, 0.0)])
hum = (0.6 * np.sin(2 * np.pi * 55 * t) + 0.4 * np.sin(2 * np.pi * 110 * t)) * hum_env

# --- Capa 2: 220Hz que se suma a partir de 1.0s -----------------------------
layer_220_env = envelope(t, [(1.0, 0.0), (1.3, 0.22), (3.3, 0.4), (3.4, 0.0)])
layer_220 = np.sin(2 * np.pi * 220 * t) * layer_220_env

# --- Capa 3: ruido rosa filtrado, muy tenue ---------------------------------
pink_env = envelope(t, [(1.0, 0.0), (1.4, 0.08), (3.3, 0.14), (3.4, 0.0)])
pink_raw = pink_noise(N)
sos = signal.butter(2, [200, 3200], btype="bandpass", fs=SR, output="sos")
pink_filtered = signal.sosfilt(sos, pink_raw)
pink_filtered /= np.max(np.abs(pink_filtered)) + 1e-9
pink = pink_filtered * pink_env

# --- Capa 4: riser corto 3.3-3.7s, barrido ascendente -----------------------
riser_env = envelope(t, [(3.3, 0.0), (3.34, 0.22), (3.68, 1.0), (3.70, 0.0)])
riser_local_t = np.clip(t - 3.3, 0.0, 0.4)
riser_tone = signal.chirp(riser_local_t, f0=200, t1=0.4, f1=1900, method="logarithmic")
riser = riser_tone * riser_env

# --- Capa 5: golpe grave (sub-bass) 3.7-4.0s --------------------------------
sub_local_t = np.clip(t - 3.7, 0.0, None)
sub_freq = 38 + 70 * np.exp(-sub_local_t / 0.045)
sub_phase = 2 * np.pi * np.cumsum(sub_freq) / SR
attack = np.clip(sub_local_t / 0.003, 0.0, 1.0)
decay = np.exp(-sub_local_t / 0.10)
sub_amp = attack * decay * (t >= 3.7)
sub_hit = np.sin(sub_phase) * sub_amp

# --- Mezcla ------------------------------------------------------------------
GAIN_HUM = 1.0
GAIN_220 = 1.0
GAIN_PINK = 1.0
GAIN_RISER = 0.5
GAIN_SUB = 0.85

mix = (
    GAIN_HUM * hum
    + GAIN_220 * layer_220
    + GAIN_PINK * pink
    + GAIN_RISER * riser
    + GAIN_SUB * sub_hit
)

stereo = np.stack([mix, mix], axis=1)

# --- Normalización a ~-14 LUFS, sin clipping --------------------------------
z_l = k_weighted_mean_square(stereo[:, 0], SR)
z_r = k_weighted_mean_square(stereo[:, 1], SR)
current_lufs = -0.691 + 10 * np.log10(z_l + z_r + 1e-12)
gain_db = TARGET_LUFS - current_lufs
gain_lin = 10 ** (gain_db / 20)

peak = np.max(np.abs(stereo)) * gain_lin
if peak > PEAK_CEILING:
    gain_lin *= PEAK_CEILING / peak

stereo *= gain_lin

final_z_l = k_weighted_mean_square(stereo[:, 0], SR)
final_z_r = k_weighted_mean_square(stereo[:, 1], SR)
final_lufs = -0.691 + 10 * np.log10(final_z_l + final_z_r + 1e-12)
final_peak_db = 20 * np.log10(np.max(np.abs(stereo)) + 1e-12)

stereo_i16 = np.clip(stereo, -1.0, 1.0)
stereo_i16 = (stereo_i16 * 32767).astype(np.int16)

wavfile.write(OUT_PATH, SR, stereo_i16)

print(f"Escrito {OUT_PATH}: {N} samples, {N / SR:.3f}s, {SR}Hz estéreo")
print(f"LUFS integrado final: {final_lufs:.2f} (objetivo {TARGET_LUFS})")
print(f"Pico final: {final_peak_db:.2f} dBFS")
