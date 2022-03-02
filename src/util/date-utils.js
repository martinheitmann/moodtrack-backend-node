const moment = require("moment-timezone");

/**
 *  Creates a Moment.moment instance with the current date and zone.
 * @param {String} zone
 * @returns {Moment.moment} A moment instance with the specified zone.
 */
module.exports.getCurrentZonedDate = function (zone) {
  const timeZone = zone || "Europe/Oslo";
  const zoneObject = moment(new Date()).tz(timeZone);
  return zoneObject;
};

/**
 *  Creates a Moment.moment instance with the specified date and zone.
 * @param {Date} date
 * @param {String} zone
 * @returns {Moment.moment} A moment instance with the specified zone.
 */
module.exports.getZonedDate = function (date, zone) {
  const timeZone = zone || "Europe/Oslo";
  const zoneObject = moment(date).tz(timeZone);
  return zoneObject;
};

/**
 * Formats a Moment object.
 * @param {moment.Moment} moment
 * @returns {String} A formatted Moment string.
 */
module.exports.formatMoment = function (moment) {
  return moment.format("DD.MM.YYYY HH:mm.ss");
};
