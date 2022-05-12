const {getInteractionEntry} = require("./getInteractionEntry");
const {getConfig} = require("../common/getConfig");

function loadParticlesInteraction(moduleName, pluginName, version, dir) {
    const banner = `Author : Matteo Bruni
MIT license: https://opensource.org/licenses/MIT
Demo / Generator : https://particles.js.org/
GitHub : https://www.github.com/matteobruni/tsparticles
How to use? : Check the GitHub README
v${version}`, minBanner = `tsParticles ${pluginName} Interaction v${version} by Matteo Bruni`;

    return [
        getConfig(getInteractionEntry(moduleName, false), banner, minBanner, dir, false)
    ];
}

module.exports = {loadParticlesInteraction};
