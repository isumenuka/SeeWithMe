# SeeWithMe

SeeWithMe is an experimental React Native application that provides AI‑powered visual assistance. The core vision features are backed by the Gemma 3n on‑device model with a fallback to mocked data for development.

## Features

- **Object & Scene Recognition** – Gemma 3n analyzes camera frames to describe surroundings.
- **Text-to-Speech Narration** – spoken descriptions are generated on device.
- **OCR Reader** – reads signs and documents aloud.
- **Face Recognition & Emotion** – detects familiar faces and basic emotions.
- **Indoor Navigation Helper** – provides layout and exit guidance.
- **Multilingual** – results can be translated offline.
- **Offline First** – all processing runs locally using Gemma 3n.
- **Voice Commands** – control scanning with simple voice cues.

This repository includes only placeholder calls to Gemma 3n. Implementations should replace the stubs in `components/ai/Gemma3nClient.ts` with real model inference.
