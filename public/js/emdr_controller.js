const settings = {
    bulbCount: 25,
    background_color_on: "cyan",
    background_color_off: "white",
    height: "30px",
    bulb_pause: 10,
    edge_pause: 300,
    mode: "blink`",
    duration: 10
}

const state = {
    mode: "form",
    curPos: 0,
    direction: 1
}

async function next() {
    setBulbState(state.curPos, false);
    if (settings.mode === "blink") {
        state.curPos = state.curPos === 0 ? settings.bulbCount - 1 : 0
    } else {
        state.curPos = state.curPos + state.direction;
    }
    setBulbState(state.curPos, true);
    if (state.curPos == settings.bulbCount - 1 || state.curPos == 0) {
        state.direction = -state.direction;
        await sleep(settings.edge_pause);
    }
}


function setBulbState(position, isOn) {
    const lightbarNode = window.document.getElementById("lightbar_container")
    const bulbNode = lightbarNode.children.item(position);
    bulbNode.style.backgroundColor = isOn ? settings.background_color_on : settings.background_color_off;
}


async function setUpLightbar() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const count = 20;

    const lightbarNode = window.document.getElementById("lightbar_container")

    lightbarNode.innerHTML = "";
    for (let i = 0; i < settings.bulbCount; i++) {
        lightbarNode.append(createLightNode());
    }


}

async function start() {
    settings.background_color_on = document.forms["settings"]["color"].value;
    settings.duration = parseInt(document.forms["settings"]["duration"].value) * 1000;
    settings.mode = document.forms["settings"]["mode"].value;

    state.timeout = setTimeout(()=>{
        stop()
    },settings.duration)

    document.getElementById("settings_form").style.display = "none"
    document.getElementById("lightbar_holder").style.display = "inherit"
    state.mode = "lightbar"
    while (state.mode === "lightbar") {
        await next();
        await sleep(settings.bulb_pause);
    }
}

async function stop() {
    clearInterval(state.timeout)
    state.mode = "form"
    document.getElementById("settings_form").style.display = "inherit"
    document.getElementById("lightbar_holder").style.display = "none"
}

function createLightNode() {
    const lightNode = window.document.createElement("div");

    lightNode.classList.add("light_bulb");
    lightNode.style.height = settings.height;
    lightNode.style.backgroundColor = settings.background_color_off;

    return lightNode;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


window.onload = setUpLightbar