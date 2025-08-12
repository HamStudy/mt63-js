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
import { encodeString, initRx, processAudio } from '@hamstudy/mt63';

// Encode text to MT63 audio
const audioBuffer = encodeString(
  'Hello World',
  bandwidth,
  longInterleave,
  audioContext
);

// Decode MT63 audio to text
initRx(bandwidth, interleave, integration, squelch);
const decodedText = processAudio(audioSamples, sampleRate, length);
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
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this project.  If not, see <http://www.gnu.org/licenses/>.
