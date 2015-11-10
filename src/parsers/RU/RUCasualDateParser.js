/*
  Parse casual russian days

  Examples:
  - сегодня
  - завтра
  - послезавтра
 */
var moment = require('moment');
var PATTERN = /(сегодня|завтра|послезавтра)(?=\s+|$|\.|,)/i

var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

exports.Parser = function RUCasualDateParser() {

  Parser.apply(this, arguments);

  this.pattern = function() { return PATTERN; };

  this.extract = function(text, ref, match, opt) {
    var index = match.index;
    var text = match[0];
    var result = new ParsedResult({
        index: index,
        text: text,
        ref: ref
    });

    var refMoment = moment(ref);
    var startMoment = refMoment.clone();
    var lowerText = text.toLowerCase();

    if (lowerText == 'сегодня') {
      startMoment.add(0, 'day')
    } else if (lowerText == 'завтра') {
      startMoment.add(1, 'day');
    } else if (lowerText == 'послезавтра') {
      startMoment.add(2, 'day');
    }

    result.start.assign('day', startMoment.date())
    result.start.assign('month', startMoment.month() + 1)
    result.start.assign('year', startMoment.year())
    result.tags['RUCasualDateParser'] = true;
    return result;
  };

};