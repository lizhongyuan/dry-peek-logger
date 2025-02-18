'use strict';


const BufferPack = require('bufferpack');


class TraceId {

  constructor(option) {

    this.seq = 0; // count from 0
    this.SEQ_MAX = 4294967295; // 0xFFFFFFFF对应的十进制

    if (option && option.generatorMethod && typeof option.generatorMethod === 'function') {
      this.generator = option.generatorMethod;
    } else {
      this.generator = this.defaultGenerator;
    }
  }

  generate() {
    const traceId = this.generator();

    return traceId;
  }

  defaultGenerator() {
    this.seq = this.seq % this.SEQ_MAX + 1;

    // 4个Byte, 8位
    this.counterPrefix = Buffer.concat([
      BufferPack.pack('>L', [ this.seq ]),  // 大端序unsigned long
    ], 4).toString('hex');

    const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    const RAND_STR_LENGTH = 8;

    let randStr = '';
    for (let i = 0; i < RAND_STR_LENGTH; i++) {
      randStr += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }

    const traceId = this.counterPrefix + randStr;

    return traceId;
  }

  /*
  generateSimpleTraceId() {
    const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
    const ID_LENGTH = 8;

    let traceId = '';
    for (let i = 0; i < ID_LENGTH; i++) {
      traceId += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }

    return traceId;
  }
   */
}


module.exports = TraceId;
