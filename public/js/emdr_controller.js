const settings = {
    bulbCount: 25,
    background_color_on: "cyan",
    background_color_off: "white",
    height: "30px",
    bulb_pause: 10,
    edge_pause: 300,
    mode:"blink`"
}

const state = {
    curPos: 0,
    direction: 1
}

async function next() {
    setBulbState(state.curPos, false);
    if (settings.mode === "blink"){
        state.curPos=state.curPos===0?settings.bulbCount -1:0
    }else{
        state.curPos = state.curPos + state.direction;
    }
    setBulbState(state.curPos, true);
    if (state.curPos == settings.bulbCount - 1 || state.curPos == 0) {
        state.direction = -state.direction;
        await sleep(settings.edge_pause);
    }
}


function setBulbState(position, isOn) {
    const lightbarNode = window.document.body.firstElementChild;
    const bulbNode = lightbarNode.children.item(position);
    bulbNode.style.backgroundColor = isOn ? settings.background_color_on : settings.background_color_off;
}


async function setUpLightbar() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    const count = 20;

    const lightbarNode = window.document.body.firstElementChild;

    lightbarNode.innerHTML = "";
    for (let i = 0; i < settings.bulbCount; i++) {
        lightbarNode.append(createLightNode());
    }

    while (true) {
        await next();
        await sleep(settings.bulb_pause);
    }

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