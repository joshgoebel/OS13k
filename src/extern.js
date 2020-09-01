// @extern
// var localStorage = window.localStorage;

var localStorage;

var programsMenu, menu;

/** @type {HTMLElement} */
var windowTemplate;

/** @type {HTMLElement} */
var taskbarSpace;

/** @type {HTMLElement} */
var tray;

/** @type {HTMLElement} */
var desktop;

/** @type {HTMLElement} */
var background;

/** @type {HTMLElement} */
var popups;


/** @type {__OS13k} */
var OS13k;

class __OS13k {
  Clamp   (a, max=1, min=0) { }
  Percent (v, a, b)         { }
  Lerp    (p, a, b)         { }
  Random(max=1, min=0) {}
  Hash() {}
  randomSeed() {}

  Trophies() {}
  Trophy() {}
  GetTrophy() {}
  PlaySamples() {}
  Note() {}
  PianoKey() {}
  PlayMusic() {}
  GetAnalyser() {}
  GetAnalyserData() {}
  Speak() {}
  StopSpeech() {}
  PlaySeed() {}
  SeedSamples() {}
  SeedParameters() {}
  Settings() {}
  SaveSettings() {}
  Input() {}
  CreateShader() {}
  RenderShader() {}
  KeyDirection() {}
  StripHTML() {}
  StringToMusic() {}
  Popup() {}
}

// @js_externs OS13k.Clamp, OS13k.Percent, OS13k.Lerp, OS13k.Hash
// @js_externs OS13k.Random, OS13k.randomSeed, iframeContent.OS13kReload
// @js_externs OS13k.Trophies, OS13k.Trophy, OS13k.GetTrophy
// @js_externs OS13k.PlaySamples, OS13k.Note, OS13k.PianoKey
// @js_externs OS13k.PlayMusic, OS13k.GetAnalyser, OS13k.GetAnalyserData
// @js_externs OS13k.Speak, OS13k.StopSpeech, OS13k.PlaySeed
// @js_externs OS13k.SeedSamples, OS13k.SeedParameters
// @js_externs OS13k.Settings, OS13k.SaveSettings, OS13k.Input
// @js_externs OS13k.CreateShader, OS13k.RenderShader
// @js_externs OS13k.KeyDirection, OS13k.StripHTML, OS13k.StringToMusic, OS13k.Popup