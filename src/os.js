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
// @js_externs localStorage.OS13k, localStorage.OS13kVersion, OS13k, source.gain
// @js_externs iframeContent, iframeContent.OS13k, iframeContent.OS13kWindow
// @js_externs iframeContent.zzfx, zzfx, zzfxG, zzfxM
// @js_externs settings.v, settings.m, settings.s, settings.p, settings.o
// @js_externs settings.c, settings.d, settings.t, settings.f
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

goog.exportSymbol = () => {}
goog.exportProperty = () => {}

/** @export */
var foo = {};

/** @export */
foo.bar = 42;

if (foo.bar) {
    console.log("hi")
}

let OS13kVersion = 81;

/**
 * @define {boolean}
 * */
const ENABLE_DEBUG = true;
if (ENABLE_DEBUG) {
    // version check, clear local storage if older
    if (localStorage.OS13k && localStorage.OS13kVersion != OS13kVersion)
    {
        alert('OS13k version out of date! System reset in 3, 2, 1...');

        // save what we can
        let save = 0;//localStorage.OS13kVersion >= 70 ? localStorage.OS13k : 0;
        localStorage.clear();
        if (save)
          localStorage.OS13k = save;
    }

    localStorage.OS13kVersion = OS13kVersion;

    // load default programs if none found
    if (window.programStubs === undefined)
    {
        alert('No programs found!')
        var sticky = 2**0, reload = 2**1, awake = 2**2, full = 2**3, resize= 2**4, code = 2**5,
        closeAll = 2**7, newUserProgram = 2**8, deleteUserPrograms = 2**9,
        defaultFlags = full|reload|resize, defaultWidth = 720, defaultHeight = 405,
        programStubs = [[,'❌',,,closeAll,'Close All']];
    }
} // debug stuff

///////////////////////////////////////////////////////////////////////////////
// Minification Stuff

{


// Minification Steps
// 1. Remove touch support and optional code
// 2. Paste programs directly below here
// 3. Remove optional stuff listed below
// 4. Verify that it works the same
// 5. HTML Minifier http://minifycode.com/html-minifier/
// 6. Google Closure https://closure-compiler.appspot.com/home
// 7. JavaScript Minifier https://javascript-minifier.com/
// 8. Zip
// 9. Advzip "advzip -z -4 -i 1000 OS13kMin.zip"

// Rework stuff marked OPTIONAL for final build
// - all files must be packed together to save space
// - smaller webgl names r10215
// - move css into code, get rid of names
// - remove system trophies
// - remove console messages

} // Minification Stuff

///////////////////////////////////////////////////////////////////////////////
// OS13k Client Interface

let os_math = {
    Clamp:   (a, max=1, min=0) => { return a < min ? min : a > max ? max : a; },
    Percent: (v, a, b)         => { return b-a ? OS13k.Clamp((v-a)/(b-a)) : 0; },
    Lerp:    (p, a, b)         => { return a + OS13k.Clamp(p) * (b-a); },

    // convert string to hash value like Java's hashCode()
    Hash:    (s)    =>           { return [...s].reduce((a,c)=> c.charCodeAt()+a*31|0, 0); }

}
class _OS13k
{

/////////////////////////////////////////////////////////////////////////////
// OS13k Math


    // seeded random numbers - Xorshift
    Random(max=1, min=0)
    {
        OS13k.randomSeed ^= OS13k.randomSeed << 13;
        OS13k.randomSeed ^= OS13k.randomSeed >> 17; // note: >>> would use the full 32 bit range
        return OS13k.Lerp(Math.abs(OS13k.randomSeed ^= OS13k.randomSeed << 5) % 1e9 / 1e9, min, max);
    }

/////////////////////////////////////////////////////////////////////////////
// OS13k Trophies

    // award player with trophy
    Trophy(icon, game, name, message)
    {
        // replace commas and apostrophes
        let key, Clean = string=> OS13k.StripHTML(string||'', maxWordLength).replace(/[,`]/g, ''),

            // init trophy data
            trophyData =
            [
                icon = Clean(icon),
                game = Clean(game),
                name = Clean(name),
                message = Clean(message),
                key = icon + ',' + game + ',' + name
            ],

            // find in trophy list
            i = trophies.findIndex(e=> e[4] == key);

        // skip if same message
        if (i >=0 && trophies[i][3] == message) return;

        // add or update trophy list
        i < 0 ? trophies.unshift( trophyData ) : trophies[i] = trophyData;

        // save trophy
        localStorage['OS13kTrophy,' + key] = message;

        // use game as name if there is no name
        name || (name = game, game = '');

        // add trophy popup
        OS13k.Popup(`<div class=trophyIcon>${   // popup html
                icon || '🏆' }</div><div><b>${ // icon
                name }</b><br><i>${            // name
                game }</i></div>` +            // game
                message,                       // message
            name + '. ' + game,                // speak
            'ja');                             // language

        // save and reload trophy window
        OS13k.Save(trophyTrayIcon.program.window && trophyTrayIcon.program.window.Reload());
    }

    // get message, 0 if no trophy
    GetTrophy(game, name)
    {
        let trophy = trophies.find(e=> e[1]==game & e[2]==name);
        return trophy ? trophy[3] : 0;
    }

    // get trophy list
    Trophies() { return trophies; }

/////////////////////////////////////////////////////////////////////////////
// OS13k Audio

    // play seed sound
    PlaySeed(seed, lengthScale=1, volume=1, randomness=.05, frequency, isMusic)
    { return OS13k.PlaySamples(OS13k.SeedSamples(...arguments), isMusic); }

    // get seed samples
    SeedSamples(...parameters)
    { return zzfxG(...OS13k.SeedParameters(...parameters)); }

    // get zzfx sound parameters from seed
    SeedParameters(seed, lengthScale=1, volume=1, randomness=.05, frequency)
    {
        // use default params if no seed
        if (!seed)
            return [volume, randomness, frequency || OS13k.Note(-21), 0, lengthScale];

        // check if seed is a number
        if (parseFloat(seed = (seed+'').trim()) != seed)
        {
            // seed is not number, check if zzfx string and apply overrides
            if (seed.slice(0,9) == 'zzfx(...[')
                return seed.slice(9).split(',').map((p,i)=>
                    !i ? volume :
                    i==1 ? randomness :
                    i==2 && frequency ? frequency :
                    p.length ? parseFloat(p) : undefined);

            // use hash string as seed
            seed = OS13k.Hash(seed);
        }

        // set seed
        OS13k.randomSeed = seed;

        // helper functions
        let R=()=>OS13k.Random(), C=()=>R()<.5?R():0, S=e=>C()?e:-e,

            // randomize sound length
            attack  = R()**3/4*lengthScale,
            decay   = R()**3/4*lengthScale,
            sustain = R()**3/4*lengthScale,
            release = R()**3/4*lengthScale,
            length  = attack + decay + sustain + release,
            f = R()**2*2e3;

        // generate random sound
        return [
           volume,           // volume
           randomness,       // randomness
           frequency || f,   // frequency
           attack,           // attack
           sustain,          // sustain
           release,          // release
           R()*5|0,          // shape
           R()**2*3,         // shapeCurve
           C()**3*S(99),     // slide
           C()**3*S(99),     // deltaSlide
           C()**2*S(1e3),    // pitchJump
           R()**2 * length,  // pitchJumpTime
           C() * length,     // repeatTime
           C()**4,           // noise
           C()**3*S(9),      // modulation
           C()**4,           // bitCrush
           C()**3/2,         // delay
           1 - C(),          // sustain volume
           decay,            // decay
           C()**4            // tremolo
        ];
    }

    // play audio sample data
    PlaySamples(samples, isMusic, sampleRate=defaultSampleRate)
    { return OS13k.PlaySamplesArray([samples], isMusic, sampleRate); }

    // play array of audio sample data, connect analyser to gain if isMusic > 1 for instruments
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

    PlayMusic(song)
    {
        // catch errors when playing music
        try { return OS13k.PlaySamplesArray(zzfxM(...song), 1); }
        catch(e) { console.log(e); }
    }

    GetAnalyser() { return analyserCanvas; }
    GetAnalyserData(e) { return analyserData[e] ? analyserData[e] : 0; }

    // convert a string to a music data array, will throw error if invalid
    StringToMusic(string, validate)
    {
        // check if safe to eval and get music data
        let music = string.replace(/null|[[\],\de\.-]/g, '') || eval(string.replace(/null/g, undefined));

        // try to generate music to check if valid
        validate && zzfxM(...music, 1);
        return music;
    }

    // get frequency of a note on a musical scale
    Note(semitoneOffset=0, rootNoteFrequency=440)
    { return rootNoteFrequency * 2**(semitoneOffset/12); }

    PianoKey(event)
    {
        let k = 'ZSXDCVGBHNJM,L.;/Q2W3ER5T6Y7UI9O0P[=]'      // map key to note
            .indexOf(event.key && event.key.toUpperCase());  // find the key and check for invalid key
        return k - 5 * (k > 16);                             // offset second row of keys
    }

    // speak text
    Speak(text, language='en', stopSpeech, volume=1, rate=1, pitch=1)
    {
        // common languages (not supported by all browsers)
        // it - italian,  fr - french, de - german,  es - spanish, pl - polish
        // ja - japanese, hi - hindi,  ru - russian, zh - chinese, ko - korean

        // set utterance parameters
        let utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = volume * gain.gain.value * 2;
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.lang = language;

        // stop speech if set
        stopSpeech && StopSpeech();

        // play speech if allowed
        settings.s & finishedStartup && speechSynthesis && speechSynthesis.speak(utterance);
    }

/////////////////////////////////////////////////////////////////////////////
// OS13k Shaders

    // create pixel shader
    CreateShader(canvas, code)
    {
        // get webgl context
        const x = canvas.getContext('webgl2'),

            // use hardcoded glsl constants to save space
            xVERTEX_SHADER       = 35633,
            xARRAY_BUFFER        = 34962,
            xSTATIC_DRAW         = 35044,
            xBYTE                = 5120,
            xFRAGMENT_SHADER     = 35632,
            xCOMPILE_STATUS      = 35713,
            xTEXTURE_2D          = 3553,
            xUNPACK_FLIP_Y_WEBGL = 37440,
            xTEXTURE_MIN_FILTER  = 10241,
            xLINEAR              = 9729;

        if (!x)
            return;

        // create a simple pass through vertex shader
        let vertexShader = x.createShader(xVERTEX_SHADER);
        x.shaderSource(vertexShader, '#version 300 es\nin vec4 c;void main(){gl_Position=c;}');
        x.compileShader(vertexShader);

        // check vertex shader for errors
        //if (!x.getShaderParameter(vertexShader, x.COMPILE_STATUS))
        //    throw x.getShaderInfoLog(vertexShader);

        // create shadertoy compatible pixel shader
        let pixelShader = x.createShader(xFRAGMENT_SHADER);
        let shaderProgramCode =
            `#version 300 es\n` +
            `precision mediump float;` +
            `uniform float iTime;` +
            `uniform int iFrame;` +
            `uniform vec4 iMouse;` +
            `uniform vec3 iResolution;` +
            `uniform sampler2D iChannel0;` +
            `out vec4 OS13kcolor;\n` +
            `${code}` +
            `\nvoid main()` +
            `{mainImage(OS13kcolor,gl_FragCoord.xy);` +
            `OS13kcolor.a=1.;}`;
        x.shaderSource(pixelShader, shaderProgramCode);
        x.compileShader(pixelShader);

        // check pixel shader for errors
        if (!x.getShaderParameter(pixelShader, xCOMPILE_STATUS))
            throw x.getShaderInfoLog(pixelShader);

        // create vertex buffer that is a big triangle
        x.bindBuffer(xARRAY_BUFFER, x.createBuffer());
        x.bufferData(xARRAY_BUFFER, new Int8Array([-3,1,1,-3,1,1]), xSTATIC_DRAW);
        x.enableVertexAttribArray(0);
        x.vertexAttribPointer(0, 2, xBYTE, 0, 0, 0);

        // create texture
        x.bindTexture(xTEXTURE_2D, x.createTexture());
        x.texParameteri(xTEXTURE_2D, xTEXTURE_MIN_FILTER, xLINEAR);
        x.pixelStorei(xUNPACK_FLIP_Y_WEBGL, 1);

        // create shader program
        let shaderProgram = x.createProgram();
        x.attachShader(shaderProgram, vertexShader);
        x.attachShader(shaderProgram, pixelShader);
        x.linkProgram(shaderProgram);
        x.useProgram(shaderProgram);
        return shaderProgram;
    }

    // render a pixel shader
    RenderShader(canvas, shaderProgram, time, frame, X, Y, Z, W)
    {
        // get webgl context
        const x = canvas.getContext('webgl2'),

            // use hardcoded glsl constants to save space
            xRGBA          = 6408,
            xUNSIGNED_BYTE = 5121,
            xTRIANGLE_FAN  = 6,
            xTEXTURE_2D    = 3553;

        if (!x)
            return;

        // set uniforms
        x.uniform3f(x.getUniformLocation(shaderProgram, 'iResolution'), canvas.width, canvas.height, 1);
        x.uniform1f(x.getUniformLocation(shaderProgram, 'iTime'), time);
        x.uniform1f(x.getUniformLocation(shaderProgram, 'iFrame'), frame);
        x.uniform1i(x.getUniformLocation(shaderProgram, 'iChannel0'), 0);
        x.uniform4f(x.getUniformLocation(shaderProgram, 'iMouse'), X, Y, Z, W);

        // set vieport and render shader
        x.viewport(0, 0, canvas.width, canvas.height);
        x.drawArrays(xTRIANGLE_FAN, 0, 3);

        // set texture to newly rendered image
        x.texImage2D(xTEXTURE_2D, 0, xRGBA, xRGBA, xUNSIGNED_BYTE, canvas);
    }

/////////////////////////////////////////////////////////////////////////////
// OS13k Text

    // remove html tags from a string and clamp length
    StripHTML(string, maxLength)
    { return (string+'').substring(0, maxLength || string.length).replace(/<.*>/g, ''); }

    Popup(html, speak, language)
    {
        // create popup
        let popup = popups.appendChild(document.createElement('div'));
        popup.className = 'popup';
        popup.innerHTML = '<div style=pointer-events:none>' + html;
        popup.speak = speak;
        popup.speakLanguage = language;
        popup.style.visibility = 'hidden';
    }

/////////////////////////////////////////////////////////////////////////////
// OS13k Input

    // create and update an input object for keyboard and mouse control
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

/////////////////////////////////////////////////////////////////////////////
// OS13k Seralization

    Save()
    {
        // save data if finished startup
        finishedStartup && (localStorage.OS13k = JSON.stringify
        ([
            trophies,
            settings,
            programInfos,
            startProgramId,
            nextUserProgramId
        ]));

        // volume
        gain.gain.value = settings.v;
        gainMusic.gain.value = settings.m;

        // stop speech if not enabled or sound muted
        settings.s && settings.v || StopSpeech();

        // background
        background.style.background = `linear-gradient(${settings.c},${settings.d})`;
        background.innerText = settings.t;

        // filter
        background.style.filter = desktop.style.filter = settings.f;
    }

    SaveSettings(volume, musicVolume, speech, popups, systemSounds, color1, color2, text, filter)
    {
        // set settings and save
        OS13k.Save(settings = {
            v:gain.gain.value = volume,
            m:gainMusic.gain.value = musicVolume,
            s:speech,
            p:popups,
            o:systemSounds,
            c:color1,
            d:color2,
            t:text,
            f:filter
        });
    }

    Settings() { return settings; }
}; // _OS13k
/** @export {_OS13k} */
var OS13k = new _OS13k;
Object.assign(OS13k, os_math)

///////////////////////////////////////////////////////////////////////////////
// OS13k System Functions and Consts - handles non client facing features of OS13k

const taskbarHeight = 44, titlebarHeight = 37, programHeight = 26,
      startOpenOffset = 99, popupTime = 3, defaultVolume = .3,
      maxWordLength = 32, defaultSampleRate = 44100, analyserWaitTime = 1e4,

    // system sounds
    soundOpen       = 87,
    soundClose      = 92,
    soundGrabStart  = 45,
    soundGrabEnd    = 66,
    soundMenu       = -9,
    soundActive     = 66,
    soundShrink     = 75,
    soundGrow       = 61,
    soundFullScreen = -9,
    soundHelp       = 22,
    soundCode       = 16,
    soundReload     = -5,
    soundProgram    = 6,
    soundSave       = 6;

///////////////////////////////////////////////////////////////////////////////
// Global Variables

let grabWindow, grabOffsetX, grabOffsetY, finishedStartup, nextUserProgramId = 0,
    activeWindow, activeProgram, activeTaskbarIcon, loadIcon, allCodeIsSafe,
    analyserCanvas = document.createElement('canvas'), analyserData = [], lastMusicTime = -analyserWaitTime,
    lastActiveFrame, topZ = 0, loading = 0, hadInput = 0,
    windowOpenX = startOpenOffset, windowOpenY = startOpenOffset + taskbarHeight,
    startProgram, startProgramId, programInfos = [], trophies = [],
    trophyTrayIcon, settingsTrayIcon, clockTrayIcon, musicTrayIcon, stickyNoteTrayIcon,

    // volume, music, speech, popups, color1, color2, text, filter
    settings = {v:.3, m:.3, s:1, p:1, o:1, c:'#222233', d:'#332222', t:'OS13k', f:''},

    // init web audio
    audioContext = new (window.AudioContext||webkitAudioContext),
    gain = audioContext.createGain(),
    gainMusic = audioContext.createGain(),
    musicAnalyser = audioContext.createAnalyser(),


// main update loop
Update = time=>
{
    // request new animation frame
    requestAnimationFrame(Update);

    // update startup routine
    loading | finishedStartup || OS13k.Save(

        // create analyser canvas
        musicTrayIcon.prepend(analyserCanvas),
        analyserCanvas.style = 'width:16;height:16;margin:2;pointer-events:none;display:none',

        // load start program
        self == top && startProgram && startProgram.Open(), finishedStartup = 1);

    // check if iframe became new active element
    let activeElement = document.activeElement,
        activeFrame = activeElement.shadowRoot && activeElement.shadowRoot.activeElement == activeElement.iframe ?
        activeElement.iframe : 0;

    // if a new frame took focus, set window active and that we had input
    activeFrame && lastActiveFrame != activeFrame && activeElement.SetActive(hadInput = 1);

    // set last active frame
    lastActiveFrame = activeFrame;

    // fade in desktop after loading, convert opacity to number
    document.body.style.opacity = OS13k.Clamp(!loading*.02 + document.body.style.opacity*1);

    // update trophy count
    trophyTrayIcon.innerHTML = trophies.length + '🏆';

    // update time
    clockTrayIcon.title = Date();
    clockTrayIcon.innerHTML = clockTrayIcon.title.
        replace(/.* (\d+):(\d+).*/, (a,b,c)=> (b%12||12)+':'+c);

    // show popups after startup is finished and there was input
    if (!finishedStartup | !hadInput) return;

    // get analyser data
    let frequencyData = new Uint8Array(musicAnalyser.fftSize = 512),
        context = analyserCanvas.getContext('2d');
    musicAnalyser.getByteFrequencyData(frequencyData);
    analyserCanvas.width = analyserCanvas.height = 32;

    // render analyser
    for(let i = 0; i < 32; )
    {
        // get frequency band volume and adjust for loudness
        let volume = (frequencyData[i+3] / 255)**3 * (1 + Math.log10((i+3) * defaultSampleRate / 1024 ));

        // draw loudness bar
        context.fillStyle = `hsl(${-99-59*volume} 99%50%)`;
        context.fillRect(i, 31, 1, -7*volume);

        // set anaylzer data, normalize between 0-1
        analyserData[i++] = OS13k.Clamp(volume / 5);

        // save how long there has been no music
        lastMusicTime = volume ? time : lastMusicTime;
    }

    // set analyser visibility
    analyserCanvas.style.display = time - lastMusicTime < analyserWaitTime ? '' : 'none';

    // update popups, use copy to prevent skipping if removed
    let offsetY = 0;
    [...popups.children].map((popup,i)=>
    {
        // speak popup
        popup.speak && OS13k.Speak(popup.speak, popup.speakLanguage);
        popup.speak = 0;

        if (!settings.p)
            popups.removeChild(popup);
        else if (!document.fullscreenElement)
        {
            // move popup up, set to bottom if it was invisible
            let y = popup.style.visibility ? window.innerHeight : parseInt(popup.style.top) + offsetY - 9;
            popup.style.visibility = '';

            if (y < taskbarHeight)
            {
                // stop popup below taskbar
                y = taskbarHeight;

                // fade out popup if at top
                if (!i && (popup.style.opacity = (popup.style.opacity || popupTime) - .01) < 0)
                {
                    // remove when invisible and adjust for height
                    offsetY += popup.getBoundingClientRect().height;
                    popups.removeChild(popup);
                }
            }

            // set popup position
            popup.style.top = y;
        }
    });
},

RebuildMenu = ()=>
{
    // combine old stubs for reference to flat array
    let oldStubs = [],
        getOldStubs = stubs => stubs.map( stub => stub[7] ? getOldStubs(stub[7]) : oldStubs.push(stub));
    getOldStubs(programStubs);

    // remove user folder if it exists
    loadIcon && loadIcon.windowOrMenu.lastChild && (
      loadIcon.windowOrMenu.removeChild(loadIcon.windowOrMenu.lastChild),
      programStubs.pop());

    CreateUserFolder(programStubs, ['😀',,,,,'User Programs'], '', oldStubs);
    loadIcon.windowOrMenu.Rebuild();
},

CreateUserFolder = (parentStubs, stub, userFolderName, oldStubs)=>
{
    let folderStubs =
    [
        ['📌',,,,newUserProgram,'New User Program',,,,userFolderName],
        ['⚠️',,,,deleteUserPrograms, userFolderName ? `Delete User Folder ${userFolderName}` : 'Delete User Programs',,,,userFolderName]
    ];

    // add subfolders
    let folderNames = [];
    userFolderName || programInfos.map(i=> i.code != undefined && i.userFolder &&
        !folderNames.includes(i.userFolder) &&
            CreateUserFolder(folderStubs,['📁',,,,,i.userFolder], i.userFolder, oldStubs, folderNames.push(i.userFolder)));

    // add stubs for programs in this folder
   programInfos.map(i=> i.code != undefined && i.userFolder == userFolderName &&

        // add stubs to folder, check if it already existed first
        folderStubs.push(oldStubs.find(stub => stub[8] == i.id) ||
            [i.icon,,i.width,i.height,defaultFlags|code,i.name,,,i.id,i.userFolder])
        );

    // set folder stubs and add to parent stubs
    stub[7] = folderStubs;
    parentStubs.push(stub);
},

// close all menus
CloseMenus = ()=>
{
    // hide all menus
    [...programsMenu.children].map(e=>e.style.visibility = menu.style.visibility = '');

    // unselect active program
    activeProgram && (activeProgram.className = 'program');
},

// try to give trophy if key is valid
CheckForTrophy = (key, keyParts = key ? key.split(',') : [])=>
    keyParts.shift() == 'OS13kTrophy' &&
        (keyParts.length = 3, OS13k.Trophy(...keyParts, localStorage[key])),

// stop any current or queued speech
StopSpeech = ()=> speechSynthesis && speechSynthesis.cancel(),

// play system sound if enabled
SystemSound = (...parameters)=> finishedStartup & hadInput & settings.o && OS13k.PlaySeed(...parameters);

///////////////////////////////////////////////////////////////////////////////
// OS13kProgramMenu - holds a list of programs

class OS13kProgramMenu extends HTMLElement
{
	constructor(stubs, parentMenu)
    {
		super();

        // add to programs menu
        this.className    = 'programMenu';
        this.parentMenu   = parentMenu;
        this.programStubs = stubs;
    }

    Rebuild(y = 0)
    {
        // add programs to menu
        for(let stub of this.programStubs)
        {
            // create program and menu
            let program = stub[-1] = stub[-1] || new OS13kProgram(...stub);
            program.programMenu = program.folder ? new OS13kProgramMenu(program.folder, this) : this;
        }

        // clear programs menu
        this.innerHTML = '';
        programsMenu.appendChild(this);

        // add programs to menu
        this.programStubs.map(stub=> this.appendChild(stub[-1]));

        // set position
        this.style.top  = y;
        this.style.left = this.parentMenu && this.parentMenu.getBoundingClientRect().right;

        // add folders after programs so width is correct
        this.programStubs.map(stub=>
        {
            // rebuild child program menus
            stub[-1].programMenu != this && stub[-1].programMenu.Rebuild(y);

            // add program height as we move down list
            y += programHeight;
        });
    }

    SetActive()
    {
        // close menus so they can reopen with this active
        CloseMenus();

        // set parent active
        this.parentMenu && this.parentMenu.SetActive();

        // make visible
        this.style.visibility = 'visible';
    }

    NewUserProgram(copyProgram, userFolder)
    {
        // create new program
        let stub = copyProgram ?
            [copyProgram.icon,, copyProgram.width, copyProgram.height, defaultFlags|code,
                copyProgram.name + '+', , ,++nextUserProgramId, copyProgram.userFolder] :
            ['✋',,,,defaultFlags|code,,,,++nextUserProgramId, userFolder];
        let program = stub[-1] = new OS13kProgram(...stub);

        // add to menu program infos
        this.programStubs.push(stub);

        // set code, copy if passed in, use default if none found
        program.info.code = copyProgram ? (
            program.info.scale = copyProgram.info.scale,
            windowOpenX = copyProgram.info.x,
            windowOpenY = copyProgram.info.y + titlebarHeight,
            copyProgram.info.code)
            :
            '// Auto detects HTML, Dweet, or Shadertoy! You can drop files here too. ✌️😄\n' +
            'for(x.fillRect(0,0,i=s=2e3,s);i--;x.globalAlpha=.1)\n' +
            'x.clearRect((S(i)*1e9-t*i/9)%s,i*9%s,i%9,i%9)';

        // mark code as safe, open, and show code, prevent iframe focus so code can be focused
        program.Open(program.userProgram = allCodeIsSafe = 1);
        program.window.ShowCode(1);
        program.window.codeText.focus();

        // set menu and rebuild menus
        RebuildMenu(program.programMenu = this);
        return program;
    }

} // OS13kProgramMenu
customElements.define('m-', OS13kProgramMenu);

///////////////////////////////////////////////////////////////////////////////
// OS13kProgram - stores program info and handles loading from folders

class OS13kProgram extends HTMLElement
{
	constructor(icon='💠', src='', width=defaultWidth, height=defaultHeight, flags, name='', help='', folder, userProgramId, userFolder)
    {
        super();

        // split source by . to get extension
        let srcParts = src.split('.');

        // split source by / to get filename to convert camel case to nice name
        let srcCleanName = srcParts[0].split('/').pop().replace(/([a-z](?=[A-Z]))/g, '$1 ');
        name = name || srcCleanName && (srcCleanName[0].toUpperCase() + srcCleanName.slice(1));

        // check for special extensions
        this.isDweet =  srcParts[1] == 'dweet';
        this.isShader = srcParts[1] == 'shader';

        // set code only if help not shown or if has extension and not disabled
        this.code = !(this.help = help) && (flags & code || ((this.isDweet | this.isShader) && flags == undefined));

        // set icon data
        this.className  = 'program';
        this.src        = src;
        this.width      = width;
        this.height     = height;
        this.folder     = folder;
        this.id         = userProgramId || name;
        this.userFolder = userFolder;
        this.flags      = flags = flags || defaultFlags;

        // set the program name and id
        this.SetName(icon, name);

        // load saved program data
        this.Load();

        // save special programs
        name == 'Music Player' && musicTrayIcon.SetProgram(this);
        name == 'Trophy Case'  && trophyTrayIcon.SetProgram(this);
        name == 'Settings'     && settingsTrayIcon.SetProgram(this);
        name == 'Sticky Note'  && stickyNoteTrayIcon.SetProgram(this);
        name == 'Clock'        && clockTrayIcon.SetProgram(this);

        // open help if it has not been opened yet
        name == 'Help' & this.info.open == undefined && (startProgram = this);

        // check if sticky open or start program
        this.flags & sticky ? this.info.open && this.Open() : this.id == startProgramId && (startProgram = this);
    }

    SetName(icon, name)
    {
        // icon
        this.icon = icon;
        this.innerHTML = '<span style="pointer-events:none;width:45;text-shadow:1px 1px 3px#000;text-align:center;overflow:hidden">' + icon;

        // name and folder
        this.innerHTML += `<div style=flex:1;padding-right:9;pointer-events:none>${
                this.name = OS13k.StripHTML(name) || 'User Program ' + this.id
            }</div>` + (this.folder? '▶' : '');
    }

    Move()
    {
        // set container program menu active
        this.programMenu.SetActive();

        // set active
        this.className = 'program programActive';
        activeProgram !=this && SystemSound(soundProgram, 0);
        activeProgram = this;
    }

    Open()
    {
        if (this.window)
        {
            // set window to be active and clamp
            this.window.SetActive(1, 1);
        }
        else if (this.flags & newUserProgram)
        {
            // create user program with default code
            this.programMenu.NewUserProgram(undefined, this.userFolder);
        }
        else if (this.flags & deleteUserPrograms && confirm(this.name + '?'))
        {
            // close windows with matching folder
            [...desktop.children].map(child=> child.Close && (this.userFolder ?
                child.program.info.userFolder == this.userFolder : child.program.info.code != undefined) && child.Close());

            // remove user program infos
            programInfos = programInfos.filter(info=> info.code == undefined || this.userFolder && info.userFolder != this.userFolder);

            // rebuild menu and play sound
            RebuildMenu(OS13k.Save(SystemSound(soundClose, 4)));
        }
        else if (this.flags & closeAll)
        {
            // close all windows if no src or folder and play sound
            [...desktop.children].map(child=> child.Close && child.Close());

            // reset window open position
            windowOpenX = startOpenOffset;
            windowOpenY = startOpenOffset + taskbarHeight;

            OS13k.Trophy('☕','OS13k','Coffee Is For Closers','Closed All');
        }
        else if (this.src || this.userProgram)
        {
            // get saved window position
            let x = this.info.x, y = this.info.y;

            // update window open positions if no position was set
            x || (
                x = windowOpenX,
                y = windowOpenY,
                (windowOpenX += titlebarHeight) > 400 && (windowOpenX =  windowOpenY = startOpenOffset),
                (windowOpenY += titlebarHeight) > 300 && (windowOpenY =  windowOpenY = startOpenOffset + taskbarHeight));

            // open window
            this.window = new OS13kWindow(this, x, y);

            // update info and save
            this.Save();
        }
    }

    SetActive() { this.Open(); }

    Toggle() { activeWindow && activeWindow == this.window ? this.window.Close() : this.Open(); }

    Load()
    {
        // load saved program info from local storage
        let i = programInfos.findIndex(e=> e.id == this.id);
        this.info = i < 0 ? {} : programInfos[i];

        // check for user code
        this.userProgram = this.info.code != undefined;
    }

    // save program info and reset settings when closed if non sticky
    Save(open = 1)
    {
        // build save info
        this.info =
        {
            open,
            id: this.id,
            x: open | this.flags & sticky ? parseInt(this.window.style.left) : 0,
            y: parseInt(this.window.style.top),
            scale: open | this.flags & sticky ? this.window.scale : 1,

            // user program info
            name: this.name,
            icon: this.icon,
            width: this.width,
            height: this.height,
            code: this.info.code,
            allowSleep: this.userProgram? this.window.allowSleep.checked : 1,
            liveEdit: this.window.liveEdit.checked,
            userFolder: this.userFolder
        }

        // add to programs info and save
        let i = programInfos.findIndex(e=> e.id == this.id);
        OS13k.Save(i < 0 ? programInfos.push(this.info) : programInfos[i] = this.info);
    }

} // OS13kProgram
customElements.define('p-', OS13kProgram);

///////////////////////////////////////////////////////////////////////////////
// OS13kWindow - window to a running program, handles program loading

class OS13kWindow extends HTMLElement
{
	constructor(program, x, y)
    {
		super();

        // add to desktop
        desktop.appendChild(this);

        // save settings
        this.program = program;
        this.style.left = x;
        this.style.top = y;
        this.menu = 1;
        this.activeCount = 0;

        // shadow root
		this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = windowTemplate.textContent;

        // title bar
        this.titlebar = this.shadowRoot.appendChild(document.createElement('div'));
        this.titlebar.id = 'titlebar';

        // create title bar buttons
        let AddTitlebarIcon=(title, svg, hover, shape='path')=>
        {
            this.titlebar.innerHTML +=
            `<style>#${title.split(' ')[0]}:hover{background:#${hover}</style>` +
            `<div id=${title.split(' ')[0]} title=${title}>` +
            `<svg viewBox='0 0 10 10'style=height:100%;width:28;pointer-events:none><${
                shape} stroke=#000 fill=none ${svg} />`;
        }
        program.flags & resize &&
            AddTitlebarIcon('Grow', 'd="M2 5L8 5M5 8L5 2"', '0f0',
            AddTitlebarIcon('Shrink', 'd="M2 5L8 5"', '0ff'));
        program.flags & full && AddTitlebarIcon('Full Screen', 'x=1 y=2 width=8 height=6', 'fff', 'rect');
        program.help && AddTitlebarIcon('Help', 'd="M5 8L8 2L2 2L5 8L8 2"', '0ff');
        program.code && AddTitlebarIcon('Code', 'd="M5 2L8 8L2 8L5 2L8 8"', 'f0f');
        program.flags & reload && AddTitlebarIcon('Reload', 'cx=5 cy=5 r=3', 'ff0', 'circle');
            AddTitlebarIcon('Close', 'd="M2 2L8 8M8 2L2 8"', 'f00');

        // title bar name
        this.titlebar.prepend(this.name = document.createElement('div'));
        this.name.id = 'name';
        let SetName = ()=>
        {
            // icon and name
            this.name.innerHTML = `<span id=icon>${program.icon}`;
            this.name.innerHTML += program.name;
        }
        SetName();

        // create content wrapper
        this.iframeWrapper = this.shadowRoot.appendChild(document.createElement('div'));
        this.iframeWrapper.style.background = '#000';

        // create code/help display
        this.codeDisplay = this.shadowRoot.appendChild(document.createElement('div'));
        this.codeDisplay.style.display = 'none';

        // create code/help display
        this.codeText = this.codeDisplay.appendChild(document.createElement('textarea'));
        this.codeText.id = 'codeText';

        // use custom code
        program.userProgram ? this.codeText.value = program.info.code : this.codeText.readOnly = 1;
        this.codeText.spellcheck = 0;

        // init custom code options
        this.codeOptions = this.codeDisplay.appendChild(document.createElement('div'));
        this.codeOptions.id = 'codeOptions';
        this.codeOptions.style.display =  program.userProgram ? '' : 'none';
        this.codeOptions.style.paddingLeft = 9;

        // build the code options
        const CodeOption = (text, tagName, innerHTML='', style, type)=>
        {
            text && this.codeOptions.appendChild(document.createTextNode(text));
            let e = this.codeOptions.appendChild(document.createElement(tagName));
            e.innerHTML = innerHTML;
            e.style = style;
            e.type = type;
            return e;
        }

        // create each element for code options
        let
        screenshotButton = this.screenshot = CodeOption('', 'button', '📷'),
        iconInput = CodeOption('Icon ', 'input', '', 'width:50'),
        nameInput = CodeOption('Name ', 'input'),
        folderInput = CodeOption('Folder ', 'input'),
        nextLine = CodeOption('', 'br'),
        widthInput = CodeOption('Size ', 'input', '', 'width:50', 'number'),
        heightInput = CodeOption('x', 'input', '', 'width:50', 'number'),
        sleepInput = this.allowSleep = CodeOption('Sleep ', 'input', '', '', 'checkbox'),
        liveEditInput = this.liveEdit = CodeOption('Live Edit ', 'input', '', '', 'checkbox'),
        saveButton = CodeOption('', 'button', 'Save'),
        copyButton = CodeOption('', 'button', 'Copy'),
        deleteButton = CodeOption('', 'button', 'Delete'),
        byteSizeSpan = this.codeSize = CodeOption('', 'span', program.info.code && program.info.code.length),
        link = CodeOption(' Bytes', 'a'),
        canvas = CodeOption('', 'canvas', '', 'display:none'),
        canvasContext = canvas.getContext('2d');

        // set checkboxes
        sleepInput.checked = program.info.allowSleep != !1;
        liveEditInput.checked = program.info.liveEdit != !1;

        // error text
        this.errorText = this.codeDisplay.appendChild(document.createElement('textarea'));
        this.errorText.id = 'errorText';
        this.errorText.readOnly = !0;

        // save button
        saveButton.onmousedown = ()=>
            link.click(SystemSound(soundSave),
            link.href = URL.createObjectURL(new Blob([this.codeText.value])),
            link.download = 'OS13k_' + program.name);

        // copy button
        copyButton.onmousedown = ()=> program.programMenu.NewUserProgram(program);

        // delete button
        deleteButton.onmousedown = ()=>
        {
            // close, remove, and rebuild (must close first)
            this.Close();
            RebuildMenu(OS13k.Save(programInfos = programInfos.filter(info=> info.id != program.id)));
        }

        // screenshot button
        screenshotButton.onmousedown = ()=>
        {
            // wrap in try block in case canvas doesnt exist
            try {
                link.click(
                    // copy to a white canvas before saving
                    SystemSound(soundSave),
                    canvasContext.fillRect(0, 0,
                        canvas.width  = this.iframeContent.c.width,
                        canvas.height = this.iframeContent.c.height,
                        canvasContext.fillStyle = '#fff'),
                        canvasContext.drawImage(this.iframeContent.c, 0, 0),
                    link.href = canvas.toDataURL('image/png'),
                    link.download = 'OS13k_Image_' + program.name);
            } catch(e) {} // ignore screenshot errors
        }

        // get elements by id
        iconInput.value   = program.icon;
        nameInput.value   = program.name;
        widthInput.value  = program.width;
        heightInput.value = program.height;
        program.userFolder != undefined && (folderInput.value = program.userFolder);

        // set new icon and name when changed
        iconInput.oninput = nameInput.oninput =
        liveEditInput.oninput = e=>
        program.Save(
            SetName(this.taskbarIcon.
            SetName(program.
            SetName(OS13k.StripHTML(iconInput.value), nameInput.value))));

        folderInput.oninput = e=>
            RebuildMenu(program.Save(program.userFolder = OS13k.StripHTML(folderInput.value.trim())));

        // size options
        widthInput.onchange =
        heightInput.onchange = e=>
        {
            program.width = widthInput.value = OS13k.Clamp(widthInput.value, defaultWidth, 99);
            program.height = heightInput.value = OS13k.Clamp(heightInput.value, program.width*2, 99);

            // update to new size and clamp to desktop
            this.Resize(1);
            this.SetActive(1, 1);
        }

        // allow sleep button
        sleepInput.oninput = e=> this.Reload(1, program.Save());

        // resize window size to fit inner width while preserving aspect
        let width = program.flags & resize ?
            Math.min(program.width*(program.info.scale||1), window.innerWidth-6) :
            program.width;

        // set window width, height, and scale while preserving aspect ratio
        this.style.width = width;
        this.iframeWrapper.style.height = width * program.height / program.width;
        this.scale = width / program.width;

        // announce game when first opened
        OS13k.Speak(program.name);

        // update loading and create iframe
        this.CreateFrame(loading += !finishedStartup);
    }

    SetErrorText(message, source, line, col, e)
    {
        this.errorText.value = e ? e + (e && e.stack ? ` (${(line-1) + ':' + col})` : '') : message;
        this.errorText.style.display = this.errorText.value ? '' : 'none';
        console.log(this.errorText.value);
        return !0;
    }

    CreateFrame()
    {
        let LoadFrame = ()=>
        {
            // check if code is safe to execute
            let codeIsSafe = !this.program.userProgram | allCodeIsSafe,

                // only dweets and shadertoys can do screenshots
                hasExtension = program.isDweet | program.isShader,

                // get iframe content and document (will fail if cross site)
                iframeDocument = iframeContent.document,
                iframeText = program.userProgram ? program.info.code :
                hasExtension ? iframeDocument.body.innerText : iframeDocument.body.innerHTML;

            this.screenshot.disabled = !hasExtension | !codeIsSafe;

            // set code/help display if not user program
            program.userProgram || (this.codeText.value = program.help || iframeText);

            // pass OS13k constants to iframe
            iframeContent.OS13k = OS13k;
            iframeContent.OS13kWindow = this;
            iframeContent.zzfx = zzfx;

            // check for extensions
            if (!codeIsSafe)
            {
                iframeDocument.body.style.background = '#111';
                iframeDocument.body.innerHTML = '';
            }
            else if (hasExtension)
            {
                // create canvas
                iframeDocument.body.innerHTML =
                    `<style>canvas{width:100%;background:${
                        program.isShader ? '#000' : '#fff' }}</style><canvas id=c width=1920 height=1080>`;

                // set body style
                iframeDocument.body.style =
                    'background:#111;' +
                    'overflow:hidden;' +
                    'margin:0;' +
                    'display:flex;' +
                    'align-items:center';

                // loop protection for user dweets
                let code = program.userProgram && !program.isShader?
                    iframeText.replace(
                        /(for\s*\([^;]*;[^;]*;|while\s*\()\s*(\S)/g, (a, b, c)=>
                            b && c && !b.match(/\sof\s|\sin\s/g) ?
                                b + '++OS13kL>1e5&&(e=>{throw"Timed out!"})()' +
                                (c == ')' ? '' : ',') + c : a ) : iframeText;

                // show error messages from user code init
                program.userProgram && (window.onerror = (...parameters)=>this.SetErrorText(...parameters));

                // create dweet or shader program
                try {
                    iframeContent.eval(
                        `OS13k=parent.OS13k;x=c.getContext` +
                        (program.isShader ? // preserve buffer for user programs for screenshot
                            `('webgl2'${program.userProgram ? ',{preserveDrawingBuffer:!0}' : ''});` +
                            `X=Y=Z=W=0;` +
                            `onmousemove=e=>e.buttons&&(X=e.x,Y=c.height-e.y);` +
                            `onmousedown=e=>(X=Z=e.x,Y=W=c.height-e.y);` +
                            `onmouseup=e=>Z=W=0;` +
                            `s=OS13k.CreateShader(c,\`${ code }\`);` +
                            `OS13kU=t=>` +
                            `OS13k.RenderShader(c,s,t/1e3,frame++,X,Y,Z,W,c.width=innerWidth,c.height=innerHeight)`
                            :
                            `('2d');` +
                            `zzfx=parent.zzfx;` +
                            `S=Math.sin;C=Math.cos;T=Math.tan;` +
                            `R=(r,g,b,a=1)=>\`rgba(\${0|r},\${0|g},\${0|b},\${a})\`;` +
                            `u=t=>{\n${ code }\n};` +
                            `OS13kU=t=>t>OS13kF-2&&` +
                                `u(((t=frame++/60)*60|0==frame-1)&&t>0?t+1e-6:t,` +
                                `OS13kL=0,` +
                                `OS13kF=Math.max(OS13kF+100/6,t))`) +
                            `;(OS13kA=t=>(requestAnimationFrame(OS13kA),` +
                                (program.flags & awake || program.info.allowSleep == 0 ? '' :
                                    `t<1e3|parent.document.activeElement==OS13kWindow&&`) +
                                    `OS13kU(t)))` +
                            `(frame=OS13kF=0)`);
                } catch (e) { this.SetErrorText(e); }
            }

            // mouse down on iframe to load unsafe code, and call normal mousedown
            codeIsSafe || (iframeContent.onmousedown = e=> (this.Reload(allCodeIsSafe = 1), window.onmousedown(e)));

            // prevent iframes context menu and drop events
            iframeContent.ondrop = iframeContent.ondragover = iframeContent.oncontextmenu = ()=> !1;

            // add taskbar icon if it doesnt exist and set active
            this.taskbarIcon || (this.taskbarIcon = new OS13kTaskbarIcon(program, this)).SetActive();

            // make visible
            this.style.visibility = this.iframe.style.visibility = 'visible';

            // update loading
            loading && --loading;

            // listen for reload from iframe, prevent infnite recursion
            program.userProgram && (this.iframe.onload = ()=> reloadCount++ && this.Reload(1, 0));

            // release grab window since this one will be in front
            grabWindow && window.onmouseup();
        }

        // remove old iframe if it exists
        this.iframe && this.iframeWrapper.removeChild(this.iframe);

        // create iframe
        this.iframe = this.iframeWrapper.appendChild(document.createElement('iframe'));
        let iframeContent = this.iframeContent = this.iframe.contentWindow,
            program = this.program,
            reloadCount = 0;
        this.iframe.id = 'frame';

        // load src and force pages to be refreshed
        if (program.userProgram)
        {
            // clear error text
            this.errorText.style.display = 'none';

            // allow code editing, check for alt+enter to reload
            this.codeText.onkeydown = e=> !e.altKey || e.keyCode == 13 && this.SetCode(this.codeText.value);
            this.codeText.oninput = e=> this.liveEdit.checked && this.SetCode(this.codeText.value);

            // set on error now to catch errors on load
            iframeContent.onerror = (...parameters)=>this.SetErrorText(...parameters);

            // set code
            iframeContent.document.open();
            allCodeIsSafe && iframeContent.document.write(program.info.code);
            iframeContent.document.close();

            // get type of user code, html, shadertoy, or dweet
            program.info.code.trim()[0] != '<' ?
                program.isDweet = !(program.isShader = program.info.code.search(/void\s+mainImage/) >= 0) :
                program.isDweet = program.isShader = 0;

            // show error messages from user code
            iframeContent.onerror = (...parameters)=>this.SetErrorText(...parameters);

            // load the iframe
            LoadFrame();
        }
        else
        {
            // load source
            this.iframe.onload = ()=> LoadFrame();
            this.iframe.src = program.src + '?v259';
        }
    }

    SetCode(code, setText)
    {
        // set code when changed
        setText && (this.codeText.value = code);
        this.program.info.code = code;
        this.codeSize.innerHTML = code.length;
        this.program.Save();

        // mark code as safe and reset iframe
        this.CreateFrame(allCodeIsSafe = 1);
    }

    Open(target, x, y)
    {
        // set active if not copy button
        target.id != 'C' && this.SetActive();

        // set grab window if name is target
        if (target == this.name)
        {
            // set grab window and play sound
            grabWindow = this;
            SystemSound(soundGrabStart)

            // use grabbing cursor
            document.body.style.cursor = 'grabbing';

            // prevent anything from getting focus white grabbing
            desktop.style.pointerEvents = 'none';

            // save grab offset
            grabOffsetX = x - parseInt(this.style.left);
            grabOffsetY = y - parseInt(this.style.top);
            return;
        }

        // check for title bar buttons
        target.id == 'Full'        && this.FullScreen();
        target.id == 'Reload'      && this.Reload();
        target.id == 'Close'       && this.Close();
        target.id == 'Shrink'      && this.Resize(this.scale - .2, soundShrink);
        target.id == 'Grow'        && this.Resize(this.scale + .2, soundGrow);
        (target.id == 'Help' | target.id == 'Code') && this.ShowCode();
    }

    Resize(scale, sound)
    {
        // get new width and fix window offset
        let wNew = OS13k.Clamp(this.program.width * scale, 1920, 170);
        this.style.left = parseInt(this.style.left) + parseInt(this.style.width) - wNew;

        // set new size
        this.style.width = wNew;
        this.iframeWrapper.style.height = this.program.height * (this.scale = wNew / this.program.width);

        // update program info and play sound
        this.program.Save();
        sound && SystemSound(sound);
    }

    SetActive(active=1, clamp, focus=1)
    {
        // close menus when window is set active
        CloseMenus();

        // set style, dim non active windows
        this.className = active? 'activeWindow' : '';
        this.titlebar.className = 'titlebar titlebar' +
            (active? 'Active' : '') +
            (this.program.flags & sticky ? 'Sticky' : this.program.userProgram ? 'User' : '');
        this.iframeWrapper.style.filter = active || this.program.flags & awake ?
            '' : 'saturate(.7)brightness(.7';

        // check if active
        if (!active) return;

        // clamp window to screen
        let rect = this.getBoundingClientRect();
        clamp && (
            this.style.left = OS13k.Clamp(rect.x, window.innerWidth - rect.width, 0,
            this.style.top = OS13k.Clamp(rect.y, Math.max(taskbarHeight, window.innerHeight - rect.height), taskbarHeight)));

        // set focus to iframe using timeout
        loading || focus &&
            setTimeout(e=> document.activeElement != this && this.iframeContent && this.iframeContent.focus(lastActiveFrame = this.iframe));

        if (activeWindow != this)
        {
            // deactivate old window and set this one active and play sound
            activeWindow && activeWindow.SetActive(0);
            activeWindow = this;
            SystemSound(this.activeCount++ ? soundActive : soundOpen);

            // move z to top
            this.style.zIndex = ++topZ;

            // show menu buttons
            let MenuButton = (text, onmousedown)=>
            {
                let button = menu.appendChild(document.createElement('button'));
                button.innerText = text;
                button.onmousedown = onmousedown;
            }
            menu.innerHTML = '';
            this.program.flags & full &&   MenuButton('Full Screen', ()=> this.FullScreen());
            this.program.code &&           MenuButton('Code',        ()=> this.ShowCode());
            this.program.help &&           MenuButton('Help',        ()=> this.ShowCode());
            this.program.flags & resize && MenuButton('Reset Size',  ()=> this.SetActive(1, 1, this.Resize(1, soundGrow)));
            this.program.flags & reload && MenuButton('Reload',      ()=> this.Reload());
            MenuButton('Close', ()=> this.Close());

            // set taskbar icon active if it exists
            this.taskbarIcon && this.taskbarIcon.SetActive(active, clamp, focus);

            // save start program if finished startup and not sticky
            finishedStartup & !(this.program.flags & sticky) && OS13k.Save(startProgramId = this.program.id);
        }
    }

    FullScreen()
    {
        // reload code if it wasnt safe yet and set it is safe and play sound
        (!this.program.userProgram | allCodeIsSafe) || this.Reload(allCodeIsSafe = 1);
        SystemSound(soundFullScreen);

        // set full screen
        this.iframeContent.focus();
        this.iframeWrapper.webkitRequestFullScreen ? this.iframeWrapper.webkitRequestFullScreen() :
            this.iframeWrapper.mozRequestFullScreen ? this.iframeWrapper.mozRequestFullScreen() : 0;

        OS13k.Trophy('🕹️','OS13k','Pro Gamer','Went Full Screen');
    }

    ShowCode(silent)
    {
        // toggle showing code and play sound
        this.codeDisplay.style.display = (this.showCode = !this.showCode) ? 'inline' : 'none';
        silent || SystemSound(this.program.help ? soundHelp : soundCode);

        this.program.help || OS13k.Trophy('👨‍💻','OS13k','Hacker','Viewed Code');
    }

    Reload(silent, clamp=1)
    {
        // update program info and play sound
        this.program.userProgram && (this.program.info.code = this.codeText.value);
        this.program.Save();
        silent || SystemSound(soundReload);

        // reload program or reload iframe and set invisible
        this.iframeContent &&
            this.iframeContent.OS13kReload ?
            this.iframeContent.OS13kReload() :
            this.program.userProgram ?
                this.SetCode(this.program.info.code) :
            this.CreateFrame(this.iframe.style.visibility = '');
    }

    Close()
    {
        // remove start program if closed and play sound
        this.program.id == startProgramId && (startProgramId = '');
        SystemSound(soundClose);

        // save info and set closed
        this.program.Save(0);

        // invalidate window after info is saved
        this.program.window = 0;

        // remove taskbar icon and self
        this.taskbarIcon.remove();
        this.remove();
    }
} // OS13kWindow
customElements.define('w-', OS13kWindow);

///////////////////////////////////////////////////////////////////////////////
// OS13kTaskbarIcon - icon on taskbar for opened programs

class OS13kTaskbarIcon extends HTMLElement
{
	constructor(program, windowOrMenu)
    {
        super();

        // create icon
        this.className = 'taskbarIcon';
        this.menu = this.windowOrMenu = windowOrMenu;
        this.SetName(this.program = program);

        // add to taskbar
        taskbarSpace.before(this);
    }

    SetName()
    {
        this.innerHTML = '<div style=pointer-events:none>' + (this.program.icon || '💠');
        this.title = this.program.name;
    }

    Open() { this.SetActive(); }

    SetActive(active=1, clamp=1, focus=1)
    {
        // set window active and clamp
        active && this.windowOrMenu.SetActive(1, clamp, focus);

        // load icon cant be active taskbar item
        if (this == loadIcon)
            return SystemSound(soundMenu, .3);

        // set active style
        this.className = 'taskbarIcon ' + (active ? 'taskbarIconActive' : '');

        // if active, unselect old taskbar icon and set this active
        active && activeTaskbarIcon != this && (activeTaskbarIcon && activeTaskbarIcon.SetActive(0), activeTaskbarIcon = this);
    }

} // OS13kTaskbarIcon
customElements.define('i-', OS13kTaskbarIcon);

///////////////////////////////////////////////////////////////////////////////
// OS13kTrayIcon - icon on taskbar tray for OS shortcuts

class OS13kTrayIcon extends HTMLElement
{
	constructor()
    {
		super();

        // create tray icon and add it
        this.className = 'trayIcon';
        tray.appendChild(this);
    }

    SetProgram(program)
    {
        // set program, title, and icon
        this.program = program;
        this.title = program.name;
        this.innerHTML = program.icon;
    }

    Open() { this.program.Toggle(); }
} // OS13kTrayIcon
customElements.define('t-', OS13kTrayIcon);

///////////////////////////////////////////////////////////////////////////////
// Mouse Input

window.onmousedown = e=>
{
    // get orignal target
    const originalTarget = e.composedPath()[0];

    // check if load icon is target while programs menu was visible
    if (e.target == loadIcon && e.target.windowOrMenu.style.visibility)
    {
        // close menus because they were open
        CloseMenus();

        // reactivate active window
        activeWindow && activeWindow.SetActive();

        // prevent main document from taking focus
        return !1;
    }

    // close menus and reset program menu position, and set there has been input
    CloseMenus(programsMenu.style.left = 0, programsMenu.style.top = taskbarHeight, hadInput = 1);

    // prevent stuck grab (from tabbing to another window while grabbing)
    if (grabWindow) return window.onmouseup(e);

    // check if not left mouse button
    if (e.button)
    {
        // dont allow right click on buttons
        if (originalTarget.localName == 'button')
            return !1;

        // check for right mouse button
        if (e.button & 2)
        {
            // set target active, use load icon if no valid target
            (e.target.SetActive ? e.target : loadIcon).SetActive(1, 1, 0);

            // get which menu to open
            let targetMenu = e.target.menu ? (SystemSound(soundMenu, .1), menu) : programsMenu;

            // show context menu
            targetMenu.style.left = e.x;
            targetMenu.style.top  = e.y;
            e.target != loadIcon && (targetMenu.style.visibility = 'visible');
        }
    }
    else
    {
        // open or reactivate window if no valid target
        e.target.Open ? e.target.Open(originalTarget, e.x, e.y) : activeWindow && activeWindow.SetActive();

        // allow event to contiue only if input
        return e.target == loadIcon || /input|textarea/.test(originalTarget.localName);
    }
}

window.onmousemove = e=>
{
    // update grab position
    grabWindow ? grabWindow.style.left = e.x - grabOffsetX : 0;
    grabWindow ? grabWindow.style.top  = e.y - grabOffsetY : 0;

    // handle mouse move
    e.target.Move && e.target.Move();
}

window.onmouseup = e=>
{
    const originalTarget = e.composedPath()[0];
    originalTarget.parentElement == popups && originalTarget.remove(SystemSound(soundClose));

    // set grab window active, no clamp, and set cursor to default, unset grab
    grabWindow && (grabWindow.program.Save(),
    SystemSound(soundGrabEnd),
    grabWindow.SetActive(1, 0),
        document.body.style.cursor = desktop.style.pointerEvents = grabWindow = '');
}

// prevent default right click context menu
window.oncontextmenu = e=> !1;

///////////////////////////////////////////////////////////////////////////////
// Drag and Drop

// allow drag and drop code into editor
window.ondrop = e=>
{
    let reader = new FileReader();
    reader.onload = f=> e.target.SetActive(1, 0, e.target.SetCode(f.target.result, 1));

    // read file, set code, and set active
    e.dataTransfer.files.length && e.target.program && e.target.program.userProgram &&
        reader.readAsText(e.dataTransfer.files[0]);
    return !1;
}

// prevent default drop events
window.ondragover = ()=> !1;

///////////////////////////////////////////////////////////////////////////////
// ZzFXMicro - Zuper Zmall Zound Zynth

// play a zzfx sound
var zzfx = (...parameters)=> OS13k.PlaySamples(zzfxG(...parameters)),

// generate zzfx samples
zzfxG = (volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0, release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0, pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0, bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0)=>
{
    attack = 99 + attack * defaultSampleRate;
    release = release * defaultSampleRate;
    sustain *= defaultSampleRate;
    decay *= defaultSampleRate;
    delay *= defaultSampleRate;

    // init parameters and helper functions
    let PI2 = Math.PI*2,
    buffer = [],
    sign = v=> v>0? 1 : -1,
    length = OS13k.randomSeed = OS13k.Clamp(attack + decay + sustain + release + delay, 9*defaultSampleRate) | 0,
    startSlide = slide *= 500 * PI2 / defaultSampleRate**2,
    startFrequency = frequency *= (1 + randomness*2*Math.random() - randomness) * PI2 / defaultSampleRate,
    modPhase = sign(modulation) * PI2/4,
    t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f;

    repeatTime = repeatTime * defaultSampleRate | 0;
    pitchJumpTime *= defaultSampleRate;
    pitchJump *= PI2 / defaultSampleRate;
    deltaSlide *= 500 * PI2 / defaultSampleRate**3;
    for(modulation *= PI2 / defaultSampleRate;

        // loop and generate waveform, combine with buffer if passed in
        i < length; buffer[i] = (buffer[i++] || 0) + s)
    {
        if (!(++c%(bitCrush*100|0)))                     // bit crush
        {
            s = shape? shape>1? shape>2? shape>3?        // wave shape
                Math.sin((t%PI2)**3) :                   // 4 noise
                Math.max(Math.min(Math.tan(t),1),-1):    // 3 tan
                1-(2*t/PI2%2+2)%2:                       // 2 saw
                1-4*Math.abs(Math.round(t/PI2)-t/PI2):   // 1 triangle
                Math.sin(t);                             // 0 sin

            s = (repeatTime ?
                    1 - tremolo + tremolo*Math.sin(2*Math.PI*i/repeatTime) // tremolo
                    : 1) *
                sign(s)*(Math.abs(s)**shapeCurve) *          // curve 0=square, 2=pointy
                volume * (                                   // envelope
                    i < attack ? i/attack :                  // attack
                    i < attack + decay ?                     // decay
                    1-((i-attack)/decay)*(1-sustainVolume) : // decay falloff
                    i < attack + decay + sustain ?           // sustain
                    sustainVolume :                          // sustain volume
                    i < length - delay ?                     // release
                    (length - i - delay)/release *           // release falloff
                    sustainVolume :                          // release volume
                0);                                          // post release

            s = delay ?                                      // delay
                s/2 + (delay > i ? 0 :
                (i<length-delay? 1 : (length-i)/delay) *     // release delay
                buffer[i - delay|0]/2) : s;                  // sample delay
        }

        f = (frequency += slide += deltaSlide) *     // frequency
            Math.sin(tm * modulation - modPhase);    // modulation

        t += f - f*noise*(1 - (Math.sin(i)+1)*1e9%2);     // noise
        tm += f - f*noise*(1 - (Math.sin(i)**2+1)*1e9%2); // modulation noise

        if (j && ++j > pitchJumpTime)       // pitch jump
        {
            frequency += pitchJump;         // apply pitch jump
            startFrequency += pitchJump;    // also apply to start
            j = 0;                          // reset pitch jump time
        }

        if (repeatTime && !(++r % repeatTime)) // repeat
        {
            frequency = startFrequency;     // reset frequency
            slide = startSlide;             // reset slide
            j = j || 1;                     // reset pitch jump time
        }
    }

    return buffer;
},

///////////////////////////////////////////////////////////////////////////////
//! ZzFXM (v2.0.2) | (C) Keith Clark & Frank Force | MIT | https://github.com/keithclark/ZzFXM

zzfxM = (instruments, patterns, sequence, BPM = 125, validate) =>
{
    let instrumentParameters, i, j, k, sample, patternChannel, isSequenceEnd,
        notFirstBeat, stop, instrument, pitch, attenuation, pan,
        outSampleOffset, sampleOffset, nextSampleOffset, sampleBuffer = [],
        channelIndex = 0, hasMore = 1, channelBuffers = [[],[]],
        sampleCache = {}, beatLength = defaultSampleRate / BPM * 60 >> 2;

    // for each channel in order until there are no more
    for(; hasMore; channelIndex++)
    {
        // reset current values
        sampleBuffer = [hasMore = notFirstBeat = outSampleOffset = 0];

        // for each pattern in sequence
        sequence.map((patternIndex, sequenceIndex) =>
        {
            // get pattern for current channel, use empty 1 note pattern if none found
            patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

            // check if there are more channels
            hasMore |= !!patterns[patternIndex][channelIndex];

            // get next offset, use the length of first channel
            nextSampleOffset = outSampleOffset + (patterns[patternIndex][0].length - 2 - !notFirstBeat) * beatLength;

            // for each beat in pattern, plus one extra if end of sequence
            isSequenceEnd = sequenceIndex == sequence.length - 1;
            for (i = 2, k = outSampleOffset; i < patternChannel.length + isSequenceEnd; notFirstBeat = ++i)
            {
                // stop if end, different instrument, or new note
                stop = i == patternChannel.length + isSequenceEnd - 1 && isSequenceEnd ||
                    instrument != (patternChannel[0] || 0) | patternChannel[i] | 0;

                // fill buffer with samples for previous beat, most cpu intensive part
                if (!validate)
                for(j = 0; j < beatLength && notFirstBeat;

                    // fade off attenuation at end of beat if stopping note, prevents clicking
                    j++ > beatLength - 99 && stop ? attenuation += (attenuation < 1) / 99 : 0
                )
                {
                    // copy sample to stereo buffers with panning
                    sample = (1-attenuation) * sampleBuffer[sampleOffset++] / 2 || 0;
                    channelBuffers[0][k] = (channelBuffers[0][k]   || 0) - sample * pan + sample;
                    channelBuffers[1][k] = (channelBuffers[1][k++] || 0) + sample * pan + sample;
                }

                // set up for next note
                if (patternChannel[i])
                {
                    // set attenuation and pan
                    attenuation = patternChannel[i] % 1;
                    pan = patternChannel[1] || 0;

                    if (patternChannel[i] | 0)
                    {
                        // get cached sample
                        sampleBuffer = sampleCache
                            [[
                                instrument = patternChannel[sampleOffset = 0] || 0,
                                pitch = patternChannel[i] | 0
                            ]] =
                            sampleCache[[instrument, pitch]] ||
                        (
                            // add sample to cache
                            instrumentParameters = [...instruments[instrument]],
                            instrumentParameters[2] *= 2 ** ((pitch - 12) / 12),
                            pitch > 0 ? zzfxG(...instrumentParameters) : []
                        );
                    }
                }
            }

            // update the sample offset
            outSampleOffset = nextSampleOffset;
        });
    }

    return channelBuffers;
}

///////////////////////////////////////////////////////////////////////////////
// Start OS13k!

// load save data
if (localStorage.OS13k)
    [trophies, settings, programInfos, startProgramId, nextUserProgramId] = JSON.parse(localStorage.OS13k);

// save and update settings
OS13k.Save();

// setup audio
gain.connect(audioContext.destination);
gainMusic.connect(audioContext.destination);

// create tray icons
trophyTrayIcon     = new OS13kTrayIcon();
musicTrayIcon      = new OS13kTrayIcon();
settingsTrayIcon   = new OS13kTrayIcon();
stickyNoteTrayIcon = new OS13kTrayIcon();
clockTrayIcon      = new OS13kTrayIcon();

// create load program taskbar icon and add folders/programs
RebuildMenu(loadIcon = new OS13kTaskbarIcon({icon:'💾', name:'Load'}, new OS13kProgramMenu(programStubs)));

// welcome message
OS13k.Trophy('👋','','Welcome to OS13k!');

// search local storage for new trophies (from other JS13k games)1
for (let key in localStorage) CheckForTrophy(key);

// listen for trophies from other windows
window.onstorage = e=> CheckForTrophy(e.key);

// stop spech if page is unloaded
window.onunload = e=> StopSpeech();

// try to update startup and kick off first update
Update();

///////////////////////////////////////////////////////////////////////////////
// Mobile Support OPTIONAL

// save if user was touching
let wasTouching;

if (window.ontouchstart !== undefined)
{
    // remove hovers, they get stuck on mobile
    let RemoveHovers = e=>
    {
        [...e.styleSheets].map(sheet=> {
        for(let i = sheet.rules.length; i--; )
            sheet.rules[i].selectorText &&
            sheet.rules[i].selectorText.match('hover') &&
            sheet.deleteRule(i)});
    }
    RemoveHovers(document);

    // handle touch event
    let ProcessTouch = e=>
    {
        // check if touching
        let touching = e.touches.length;
        if (touching)
        {
            // set event pos
            e.x = e.touches[0].clientX;
            e.y = e.touches[0].clientY;

            // pass event to mousemove and give focus to main window
            window.onmousemove(e);
        }

        // pass event to mouse down, prevent closing folders
        touching & !wasTouching & !e.target.folder && e.target != loadIcon && window.onmousedown(e);

        // pass event to mouse up
        !touching & wasTouching && window.onmouseup(e);

        // set was touching
        wasTouching = touching;

        // remove hovers from active window
        activeWindow && RemoveHovers(activeWindow.shadowRoot);

        // prevent default if not edit area
        let originalTarget = e.originalTarget || e.path[0];

        // allow event to contiue only if input
        return !e.cancelable || e.target == loadIcon || /input|textarea|button/.test(originalTarget.localName);
    }

    // set touch events
    window.ontouchstart = window.ontouchmove = window.ontouchend = window.ontouchcancel = ProcessTouch;
};
