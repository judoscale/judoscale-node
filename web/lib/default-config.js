/**
 * @fileoverview Default config options
 * @author Carlos Marques
 */

'use strict';

const defaultConfig = {
  // use built-in console.log by default
  log: console.log,

  // prefix logs so it's clear where they come from
  prefix: '[judoscale] ',

  // dynamically determine the current time at runtime
  now: null
}

module.exports = defaultConfig
