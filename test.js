/**
 * @author Titus Wormer
 * @copyright 2014 Titus Wormer
 * @license MIT
 * @module markdown-table
 * @fileoverview Test suite for `markdown-table`.
 */

'use strict';

/* Dependencies. */
var test = require('tape');
var chalk = require('chalk');
var table = require('./');

/* Tests. */
test('table()', function (t) {
  t.equal(
    table([
        ['Branch', 'Commit'],
        ['master', '0123456789abcdef'],
        ['staging', 'fedcba9876543210']
    ]),
    [
      '| Branch  | Commit           |',
      '| ------- | ---------------- |',
      '| master  | 0123456789abcdef |',
      '| staging | fedcba9876543210 |'
    ].join('\n'),
    'should create a table'
  );

  t.equal(
    table([
      ['A', 'B', 'C'],
      ['a', 'b', 'c'],
      ['a', 'b'],
      ['a'],
      [],
      ['a', 'b', ''],
      ['', 'b', 'c'],
      ['a', '', ''],
      ['', '', 'c'],
      ['', '', '']
    ], {align: 'c'}),
    [
      '|  A  |  B  |  C  |',
      '| :-: | :-: | :-: |',
      '|  a  |  b  |  c  |',
      '|  a  |  b  |     |',
      '|  a  |     |     |',
      '|     |     |     |',
      '|  a  |  b  |     |',
      '|     |  b  |  c  |',
      '|  a  |     |     |',
      '|     |     |  c  |',
      '|     |     |     |'
    ].join('\n'),
    'should work correctly when cells are missing'
  );

  t.equal(
    table([
        ['Beep', 'No.'],
        ['boop', '33450'],
        ['foo', '1006'],
        ['bar', '45']
    ], {align: ['l', 'r']}),
    [
      '| Beep |   No. |',
      '| :--- | ----: |',
      '| boop | 33450 |',
      '| foo  |  1006 |',
      '| bar  |    45 |'
    ].join('\n'),
    'should align left and right'
  );

  t.equal(
    table([
      ['Beep', 'No.', 'Boop'],
      ['beep', '1024', 'xyz'],
      ['boop', '3388450', 'tuv'],
      ['foo', '10106', 'qrstuv'],
      ['bar', '45', 'lmno']
    ], {align: ['l', 'c', 'l']}),
    [
      '| Beep |   No.   | Boop   |',
      '| :--- | :-----: | :----- |',
      '| beep |   1024  | xyz    |',
      '| boop | 3388450 | tuv    |',
      '| foo  |  10106  | qrstuv |',
      '| bar  |    45   | lmno   |'
    ].join('\n'),
    'should align center'
  );

  t.equal(
    table([
      ['Beep', 'No.'],
      ['beep', '1024'],
      ['boop', '334.212'],
      ['foo', '1006'],
      ['bar', '45.6'],
      ['baz', '123.']
    ], {align: ['', '.']}),
    [
      '| Beep |   No.    |',
      '| ---- | :------: |',
      '| beep | 1024     |',
      '| boop |  334.212 |',
      '| foo  | 1006     |',
      '| bar  |   45.6   |',
      '| baz  |  123.    |'
    ].join('\n'),
    'should align dots'
  );

  t.equal(
    table([
      ['No.'],
      ['0.1.2'],
      ['11.22.33'],
      ['5.6.7'],
      ['1.22222'],
      ['12345.'],
      ['5555.'],
      ['123']
    ], {align: ['.']}),
    [
      '|    No.      |',
      '| :---------: |',
      '|   0.1.2     |',
      '| 11.22.33    |',
      '|   5.6.7     |',
      '|     1.22222 |',
      '| 12345.      |',
      '|  5555.      |',
      '|   123       |'
    ].join('\n'),
    'should align multiple dots in a cell'
  );

  t.equal(
    table([
      ['Very long', 'Even longer'],
      ['boop', '33450'],
      ['foo', '1006'],
      ['bar', '45']
    ], {align: 'c'}),
    [
      '| Very long | Even longer |',
      '| :-------: | :---------: |',
      '|    boop   |    33450    |',
      '|    foo    |     1006    |',
      '|    bar    |      45     |'
    ].join('\n'),
    'should accept a single value'
  );

  t.test(
    table([
      ['Beep', 'No.', 'Boop'],
      ['beep', '1024', 'xyz'],
      ['boop', '3388450', 'tuv'],
      ['foo', '10106', 'qrstuv'],
      ['bar', '45', 'lmno']
    ], {align: ['left', 'center', 'right']}),
    [
      '| Beep |   No.   |   Boop |',
      '| :--- | :-----: | -----: |',
      '| beep |   1024  |    xyz |',
      '| boop | 3388450 |    tuv |',
      '| foo  |  10106  | qrstuv |',
      '| bar  |    45   |   lmno |'
    ].join('\n'),
    'should accept multi-character values'
  );

  t.equal(
    table([
      ['Branch', 'Commit'],
      ['master', '0123456789abcdef'],
      ['staging', 'fedcba9876543210']
    ], {delimiter: ' - '}),
    [
      '| Branch  - Commit           |',
      '| ------- - ---------------- |',
      '| master  - 0123456789abcdef |',
      '| staging - fedcba9876543210 |'
    ].join('\n'),
    'should create a table delimited by `delimiter`'
  );

  t.test(
    table([
      ['Branch', 'Commit'],
      ['master', '0123456789abcdef'],
      ['staging', 'fedcba9876543210']
    ], {start: ''}),
    [
      'Branch  | Commit           |',
      '------- | ---------------- |',
      'master  | 0123456789abcdef |',
      'staging | fedcba9876543210 |'
    ].join('\n'),
    'should create a table without starting border'
  );

  t.test(
    table([
      ['Branch', 'Commit'],
      ['master', '0123456789abcdef'],
      ['staging', 'fedcba9876543210']
    ], {end: ''}),
    [
      '| Branch  | Commit          ',
      '| ------- | ----------------',
      '| master  | 0123456789abcdef',
      '| staging | fedcba9876543210'
    ].join('\n'),
    'should create a table without ending border'
  );

  t.test(
    table([
      ['Branch', 'Commit'],
      ['master', '0123456789abcdef'],
      ['staging', 'fedcba9876543210']
    ], {rule: false}),
    [
      '| Branch  | Commit           |',
      '| master  | 0123456789abcdef |',
      '| staging | fedcba9876543210 |'
    ].join('\n'),
    'should create a table without rule'
  );

  t.test(
    chalk.stripColor(table([
      ['A', 'B', 'C'],
      [
        chalk.red('Red'),
        chalk.green('Green'),
        chalk.blue('Blue')
      ],
      [
        chalk.bold('Bold'),
        chalk.underline(''),
        chalk.italic('Italic')
      ],
      [
        chalk.inverse('Inverse'),
        chalk.strikethrough('Strike'),
        chalk.hidden('Hidden')
      ],
      ['bar', '45', 'lmno']
    ], {align: ['', 'c', 'r'], stringLength: stringLength})),
    [
      '| A       |    B   |      C |',
      '| ------- | :----: | -----: |',
      '| Red     |  Green |   Blue |',
      '| Bold    |        | Italic |',
      '| Inverse | Strike | Hidden |',
      '| bar     |   45   |   lmno |'
    ].join('\n'),
    'should use `fn` to detect cell lengths'
  );

  t.end();
});

/**
 * Get the length of a string, minus ANSI color
 * characters.
 *
 * @param {string} value
 * @return {string}
 */
function stringLength(value) {
  return chalk.stripColor(value).length;
}
