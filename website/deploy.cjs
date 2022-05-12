const fs = require("fs-extra");
const ghpages = require("gh-pages");

fs.copy("../engine/docs", "./docs", (copyErr) => {
    if (copyErr) {
        console.log(`Error copying docs: ${copyErr}`);
        return;
    }

    ghpages.publish("./", {
        dotfiles: true,
        message: "build: gh pages updated",
        history: false,
        user: {
            name: "Matteo Bruni",
            email: "176620+matteobruni@users.noreply.github.com"
        }
    }, function (publishErr) {
        if (!publishErr) {
            console.log("Website published successfully");
        } else {
            console.log(`Error publishing website: ${publishErr}`);
        }
    });
});
