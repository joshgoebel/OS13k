// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @language_out ECMASCRIPT_2019
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

// @js_externs localStorage.OS13k, localStorage.OS13kVersion, OS13k
// @js_externs settings.v, settings.m, settings.s, settings.p, settings.o
// @js_externs settings.c, settings.d, settings.t, settings.f


// , source.gain
// @js_externs iframeContent, iframeContent.OS13k, iframeContent.OS13kWindow
// @js_externs iframeContent.zzfx, zzfx, zzfxG, zzfxM
// @js_externs window.document.OS13kInput.x
// @js_externs window.document.OS13kInput.y
// @js_externs window.document.OS13kInput.keypress
// @js_externs window.document.OS13kInput.mousepress
// @js_externs window.document.OS13kInput.keydown
// @js_externs window.document.OS13kInput.mousedown
// @js_externs window.document.OS13kInput.mousex
// @js_externs window.document.OS13kInput.mousey
// @output_file_name OS13k.min.js
// ==/ClosureCompiler==

'use strict';

///////////////////////////////////////////////////////////////////////////////
// OS13k Debug (remove from minified)

let goog = {

}
/** @noinline */
goog.exportSymbol = (name,sym) => { console.log(name, sym) };
/** @noinline */
goog.exportProperty = ( object, publicName, symbol ) => { console.log(object, publicName, symbol) };
// goog.exportSymbol = (name,sym) => { console.log(name, sym) };



/** @export */
var foo = {};

/** @define {boolean} */
var ENABLE_DEBUG = true;

/** @export */
foo.bar = 42;

if (foo.bar) {
    console.log("hi")
}

class _OS13k {
    constructor() {
        this.name = "josh"
    }
    /** @export */
    Clamp   (a, max=1, min=0) { return a < min ? min : a > max ? max : a; }
    /** @export */
    Percent (v, a, b)         { return ba ? OS13k.Clamp((v-a)/(b-a)) : 0; }
    /** @export */
    Lerp    (p, a, b)         { return  + OS13k.Clamp(p) * (b-a); }

    /** @export */
    // convert string to hash value like Java's hashCode()
    Hash    (s)               { return [...s].reduce((a,c)=> c.charCodeAt()+a*31|0, 0); }


    /** @export */
    Boo () {
        let iframeDocument = window.document;

        // pass OS13k constants to iframe
        iframeContent.OS13k = OS13k;
        iframeContent.OS13kWindow = this;
        iframeContent.zzfx = zzfx;
        return iframeContent
    }
       // create and update an input object for keyboard and mouse control
       /** @export */
       Input(inputWindow)
       {
           let inputCopy;
           if (inputWindow.document.OS13kInput)
           {
               // make copy of last frame input
               inputCopy = {...inputWindow.document.OS13kInput};

               // get direction from wasd or arrow keys
               inputCopy.x = inputCopy.y = 0;
               inputCopy.keydown[87] | inputCopy.keydown[38] && ++inputCopy.y; // up
               inputCopy.keydown[83] | inputCopy.keydown[40] && --inputCopy.y; // down
               inputCopy.keydown[68] | inputCopy.keydown[39] && ++inputCopy.x; // right
               inputCopy.keydown[65] | inputCopy.keydown[37] && --inputCopy.x; // left
           }

           // create or clear input object
           let input = inputWindow.document.OS13kInput =
           {
               x: 0, y: 0,
               keypress: [], mousepress: [],
               keydown:   inputWindow.document.OS13kInput ? inputWindow.document.OS13kInput.keydown : [],
               mousedown: inputWindow.document.OS13kInput ? inputWindow.document.OS13kInput.mousedown : [],
               mousex:    inputWindow.document.OS13kInput ? inputWindow.document.OS13kInput.mousex : 0,
               mousey:    inputWindow.document.OS13kInput ? inputWindow.document.OS13kInput.mousey : 0,
               wheel : 0
           };

           // input functions
           inputWindow.onkeydown   = e=> e.repeat || (input.keydown[e.keyCode] = input.keypress[e.keyCode] = 1);
           inputWindow.onkeyup     = e=> input.keydown[e.keyCode] = 0;
           inputWindow.onmousedown = e=> (input.mousedown[e.button] = input.mousepress[e.button] = 1, e.button != 1);
           inputWindow.onmouseup   = e=> input.mousedown[e.button] = 0;
           inputWindow.onmousemove = e=> (input.mousex = e.x, input.mousey = e.y);
           inputWindow.onblur      = e=> (input.keydown = [], input.mousedown = []);
           inputWindow.onwheel     = e=> input.wheel = e.deltaY;

           // return last frame input
           return inputCopy || input;
       }

       /** @export */
       PlaySamplesArray(samplesArray, isMusic, sampleRate=defaultSampleRate)
       {
           // create buffer and source
           let buffer = audioContext.createBuffer(samplesArray.length, samplesArray[0].length, sampleRate),
               source = audioContext.createBufferSource();

           // copy samples to buffer and play
           samplesArray.map((d,i)=> buffer.getChannelData(i).set(d));
           source.buffer = buffer;

           // create custom gain node
           let sourceOut = source;
           source.gain || source.connect(sourceOut = source.gain = audioContext.createGain());
           sourceOut.connect(isMusic ? gainMusic : gain);

           // connect analyser and start
           isMusic && (isMusic > 1 ? sourceOut : source).connect(musicAnalyser);
           source.start();
           return source;
       }
}

/** @export */
let OS13k = new _OS13k()
console.log(OS13k.Clamp(b))

let data = localStorage.get("test")
localStorage.set("booger", 96)

console.log(localStorage.OS13k)
console.log(localStorage.OS13kVersion)

/**
 * @export
 * @suppress {duplicate}
 * */
var settings = { 'v':.3, 'm':.3, 's':1, 'p':1, 'o':1, 'c':'#222233', 'd':'#332222', 't':'OS13k', 'f':''};

console.log(settings.v)
console.log( settings.m)
console.log( settings.s)
console.log( settings.p)
console.log(settings.o)
console.log(settings.c)
console.log( settings.d)
console.log( settings.t)
console.log(settings.f)

window.document.OS13kInput = {
    x: 0, y: 0,
    keypress: [],
    mousepress: [],
    keydown:    [],
    mousedown: [],
    mousex:     0,
    mousey:     0,
    wheel : 0
};

console.log(window.document.OS13kInput.x)
console.log(window.document.OS13kInput.y)
console.log(window.document.OS13kInput.keypress)
console.log(window.document.OS13kInput.mousepress)
console.log(window.document.OS13kInput.keydown)
console.log(window.document.OS13kInput.mousedown)
console.log(window.document.OS13kInput.mousex)
console.log(window.document.OS13kInput.mousey)

window.zzfx = "booger"