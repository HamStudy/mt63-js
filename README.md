# @hamstudy/mt63

TypeScript implementation of MT63 digital mode for amateur radio communication.

## About

This project provides a TypeScript library for encoding and decoding MT63 digital mode signals, commonly used in amateur radio. The implementation is based on the fldigi MT63 code and developed by the HamStudy.org team.

## Status

🚧 **Work in Progress** - This library is currently under development and not yet ready for production use.

## Installation

```bash
npm install @hamstudy/mt63
```

## Usage

```typescript
import { MT63tx, MT63rx } from '@hamstudy/mt63';

// Encode text to MT63 audio samples
const encoder = new MT63tx(1000, false); // 1000Hz bandwidth, short interleave
const { samples, sampleRate } = encoder.encodeString('Hello World');

const audioBuffer = audioCtx.createBuffer(1, samples.length, sampleRate);
audioBuffer.copyToChannel(samples, 0);

const audioSource = audioCtx.createBufferSource();
audioSource.buffer = audioBuffer;
audioSource.connect(audioCtx.destination);
audioSource.start();

// Decode MT63 audio to text
const decoder = new MT63rx(1000, false, 4, 8.0); // bandwidth, interleave, integration, squelch
const decodedText = decoder.processAudio(audioSamples);
```

## Support Our Work

To support our efforts, check out:

- [SignalStuff.com](https://signalstuff.com/antennas) - Our main source of funding
- [HamStudy.org App Store](https://hamstudy.org/appstore) - Well engineered study apps

HamStudy.org is sponsored by Icom, which means that in a round-about sort of way Icom also sponsors this project. They really do a lot to build the ham radio community in the US so support them in whatever ways you can!

## License

@hamstudy/mt63 is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

@hamstudy/mt63 is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this project. If not, see <http://www.gnu.org/licenses/>.
