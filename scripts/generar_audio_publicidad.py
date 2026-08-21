#!/usr/bin/env python3
"""Genera public/audio_publicidad.wav para InprocPublicidad (18.0s, 48kHz estéreo).

Música corporativa sintetizada con numpy/scipy — no se descarga ni
referencia ningún archivo externo.

  - Base de acordes sostenidos: progresión I-V-vi-IV en Do mayor
    (C - G - Am - F), cada uno ~4.5s, onda sine + un armónico suave,
    con crossfade entre acordes para que no haya clics.
  - Pulso rítmico tenue cada 0.5s (golpe corto y suave).
  - Envolvente de volumen general:
      0-11s   bajo (deja espacio a la narración)
      11-15s  sube ligeramente (aparece el logo)
      15-18s  se sostiene y cierra con un decaimiento limpio

El resultado se normaliza a ~-14 LUFS integrado (ITU-R BS.1770) sin clipping.
"""

import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 48000
DURATION = 18.0
N = int(round(SR * DURATION))
t = np.arange(N) / SR

OUT_PATH = "public/audio_publicidad.wav"
TARGET_LUFS = -14.0
PEAK_CEILING = 10 ** (-0.3 / 20)  # ~-0.3 dBFS safety margin, never clip

rng = np.random.default_rng(20241105)


def smoothstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)


def envelope(t, points):
    """Piecewise smoothstep envelope through (time, value) points."""
    out = np.full_like(t, points[0][1], dtype=float)
    for (t0, v0), (t1, v1) in zip(points[:-1], points[1:]):
        mask = (t >= t0) & (t <= t1)
        local = smoothstep((t[mask] - t0) / (t1 - t0))
        out[mask] = v0 + (v1 - v0) * local
    out[t > points[-1][0]] = points[-1][1]
    return out


def k_weighted_mean_square(x, sr):
    """Per-channel mean square after ITU-R BS.1770 K-weighting (48kHz coeffs)."""
    b1 = [1.53512485958697, -2.69169618940638, 1.19839281085285]
    a1 = [1.0, -1.69065929318241, 0.73248077421585]
    b2 = [1.0, -2.0, 1.0]
    a2 = [1.0, -1.99004745483398, 0.99007225036621]
    stage1 = signal.lfilter(b1, a1, x)
    stage2 = signal.lfilter(b2, a2, stage1)
    return np.mean(stage2 ** 2)


# --- Progresión de acordes sostenidos (Do mayor: I - V - vi - IV) ----------
CHORD_DURATION = 4.5
CHORDS = [
    (261.63, 329.63, 392.00),  # C  (I)
    (196.00, 246.94, 293.66),  # G  (V)
    (220.00, 261.63, 329.63),  # Am (vi)
    (174.61, 220.00, 261.63),  # F  (IV)
]

pad = np.zeros(N)
CROSSFADE = 0.35
for i, chord in enumerate(CHORDS):
    t0 = i * CHORD_DURATION
    t1 = t0 + CHORD_DURATION
    gate = envelope(
        t,
        [
            (t0, 0.0),
            (t0 + CROSSFADE, 1.0),
            (t1 - CROSSFADE, 1.0),
            (t1, 0.0),
        ],
    )
    tone = np.zeros(N)
    for freq in chord:
        tone += 0.6 * np.sin(2 * np.pi * freq * t)
        tone += 0.15 * np.sin(2 * np.pi * freq * 2 * t)  # armónico suave
    pad += tone * gate

pad /= np.max(np.abs(pad)) + 1e-9

# --- Pulso rítmico tenue cada 0.5s -------------------------------------------
PULSE_PERIOD = 0.5
PULSE_DUR = 0.09
pulse_phase = np.mod(t, PULSE_PERIOD)
pulse_local = np.clip(pulse_phase / PULSE_DUR, 0.0, 1.0)
pulse_env = np.where(pulse_phase < PULSE_DUR, np.exp(-pulse_local * 5) * (pulse_phase < PULSE_DUR), 0.0)
pulse = np.sin(2 * np.pi * 110 * t) * pulse_env
pulse /= np.max(np.abs(pulse)) + 1e-9

# --- Envolvente general de volumen -------------------------------------------
master_env = envelope(
    t,
    [
        (0.0, 0.0),
        (0.4, 0.45),
        (11.0, 0.5),
        (15.0, 1.0),
        (17.3, 1.0),
        (18.0, 0.0),
    ],
)

GAIN_PAD = 1.0
GAIN_PULSE = 0.22

mix = (GAIN_PAD * pad + GAIN_PULSE * pulse) * master_env
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
