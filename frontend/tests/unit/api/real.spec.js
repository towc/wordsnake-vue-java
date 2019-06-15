import { assert } from 'chai';

import config from '@/config';
import api from '@/api/real';

describe('real-api', () => {
  describe('util', () => {
    it('removeNoise should provide a new string without noiseChars', () => {
      const { removeNoise } = api.util;

      assert.equal(removeNoise('hi,there'), 'hi,there', 'non-noisy');
      assert.equal(removeNoise('h.i,there'), 'hi,there', 'single noisy char');
      assert.equal(removeNoise('h.i,th.ere'), 'hi,there', 'double noisy char');
      assert.equal(removeNoise('.hi,t~+h.er(e'), 'hi,there', 'many noisy chars, and on start');
      assert.equal(removeNoise('.hi,~y+.ou('), 'hi,you', 'many noisy chars, on both ends');
      assert.equal(removeNoise(config.api.noiseChars.join('')), '', 'all noisy chars, and only noisy chars');
    });

    it('removeNulls should provide an array without `null` strings', () => {
      const { removeNulls } = api.util;

      // lowercase 'null' will never be a word from the API, as those words are always uppercase
      // so no risk of breaking any chains

      assert.deepEqual(removeNulls(['hi', 'there']), ['hi', 'there'], 'without nulls');
      assert.deepEqual(removeNulls(['hi', 'null', 'there']), ['hi', 'there'], 'with null in middle');
      assert.deepEqual(removeNulls(['null', 'hi', 'there']), ['hi', 'there'], 'with null in start');
      assert.deepEqual(removeNulls(['hi', 'there', 'null']), ['hi', 'there'], 'with null in end');
      assert.deepEqual(removeNulls(['null', 'hi', 'null', 'you', 'null']), ['hi', 'you'], 'with null around everything');
      assert.deepEqual(removeNulls(['null', 'null', 'null', 'null', 'null']), [], 'with only null');
    });

    it('parseList should take a noisy list of possibly null elements, and return a valid elements', () => {
      const { parseList } = api.util;

      // taken from actual api calls
      assert.deepEqual(parseList('HYDRATED,DISPROVEN,NDJAMENA,APPALACHIAN,NEARING,GLEAM,MICROLOAN,NULLIFYING,GOTTEN,NUMERICAL,LATCH,HINGE,ELECTED,DOGGEDNESS,SPER.M#S,SHYER,RETOUCHING,GILES,SPHEROID,DESTINIES'), ['HYDRATED', 'DISPROVEN', 'NDJAMENA', 'APPALACHIAN', 'NEARING', 'GLEAM', 'MICROLOAN', 'NULLIFYING', 'GOTTEN', 'NUMERICAL', 'LATCH', 'HINGE', 'ELECTED', 'DOGGEDNESS', 'SPERMS', 'SHYER', 'RETOUCHING', 'GILES', 'SPHEROID', 'DESTINIES']);
      assert.deepEqual(parseList('ARGUS,SCULLION,NUMBER,RAMPAGING,GUMD!ROP,PASTORAL,LORDLIEST,TROMBONE,EGOTIST,TRANSPOSES,SPANIARD,DIVERGES,SHIED,DEMAGNETIZE,EASTERNER,RICOCHETS,STRENGTHS,STARLIT,TRICYCLE,EXPLODE'), ['ARGUS', 'SCULLION', 'NUMBER', 'RAMPAGING', 'GUMDROP', 'PASTORAL', 'LORDLIEST', 'TROMBONE', 'EGOTIST', 'TRANSPOSES', 'SPANIARD', 'DIVERGES', 'SHIED', 'DEMAGNETIZE', 'EASTERNER', 'RICOCHETS', 'STRENGTHS', 'STARLIT', 'TRICYCLE', 'EXPLODE']);
      assert.deepEqual(parseList('HBO,OV:A,ACHE,EONS,SITS,SAC,CLEF,FEAR,RUSE,ELAM,MANY,YIPS,SALE,EM~IL,LUTE,EDDY,YAMS,SAGO,OPAL,LAZE'), ['HBO', 'OVA', 'ACHE', 'EONS', 'SITS', 'SAC', 'CLEF', 'FEAR', 'RUSE', 'ELAM', 'MANY', 'YIPS', 'SALE', 'EMIL', 'LUTE', 'EDDY', 'YAMS', 'SAGO', 'OPAL', 'LAZE']);
      assert.deepEqual(parseList('CO(B,BAAL,LIEF,FATE,ERR,RUNG,GALL,LEAH,HYPE,EONS,SOLE,ETON,NAIR,RITZ,Z~ORN,NETS,SHES,STUB,BANE,ELM'), ['COB', 'BAAL', 'LIEF', 'FATE', 'ERR', 'RUNG', 'GALL', 'LEAH', 'HYPE', 'EONS', 'SOLE', 'ETON', 'NAIR', 'RITZ', 'ZORN', 'NETS', 'SHES', 'STUB', 'BANE', 'ELM']);
      assert.deepEqual(parseList('FIX,null'), ['FIX']);
      assert.deepEqual(parseList('WAX,null'), ['WAX']);
      assert.deepEqual(parseList('DEVAST#ATED,DIRECTORSHIP,PILLION,N+ICKNA(MES,STRATOSPHERES,SOLEMNIZES,SKYPE,EXTERNALS,SEQUIN#S,SMOKE,E!-ASYG-OI.NG,GUARANTEE,(EXPLAINS,SCR)OUNGE,EPIDERMIS,SHAKEN,NABBED,DISSEMINATE,EMBITTERED,DAI!RY#MAIDS,STOMPED,DIETA(R:Y,YESSED),DEFLATION,NONSECTARIAN,NONC!-ONFORMIST,TOEHOLDS,SOCIABLE,EPAULETTE-S'), ['DEVASTATED', 'DIRECTORSHIP', 'PILLION', 'NICKNAMES', 'STRATOSPHERES', 'SOLEMNIZES', 'SKYPE', 'EXTERNALS', 'SEQUINS', 'SMOKE', 'EASYGOING', 'GUARANTEE', 'EXPLAINS', 'SCROUNGE', 'EPIDERMIS', 'SHAKEN', 'NABBED', 'DISSEMINATE', 'EMBITTERED', 'DAIRYMAIDS', 'STOMPED', 'DIETARY', 'YESSED', 'DEFLATION', 'NONSECTARIAN', 'NONCONFORMIST', 'TOEHOLDS', 'SOCIABLE', 'EPAULETTES']);
    });
  });
});
