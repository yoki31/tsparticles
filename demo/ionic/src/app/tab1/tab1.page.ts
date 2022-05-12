import { Component } from '@angular/core';
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: [ 'tab1.page.scss' ]
})
export class Tab1Page {
  particlesId = 'tsparticles';
  particlesOptions = {
    fullScreen: {
      enable: true
    },
    background: {
      color: {
        value: '#0d47a1'
      }
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push'
        },
        onHover: {
          enable: true,
          mode: 'repulse'
        },
        resize: true
      },
      modes: {
        bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40,
          speed: 3
        },
        push: {
          quantity: 4
        },
        repulse: {
          distance: 200,
          duration: 0.4
        }
      }
    },
    particles: {
      color: {
        value: '#ffffff'
      },
      links: {
        color: '#ffffff',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1
      },
      collisions: {
        enable: true
      },
      move: {
        direction: 'none',
        enable: true,
        outMode: 'bounce',
        random: false,
        speed: 6,
        straight: false
      },
      // eslint-disable-next-line id-blacklist
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 80
      },
      opacity: {
        value: 0.5
      },
      shape: {
        type: 'circle'
      },
      size: {
        random: true,
        value: 5
      }
    },
    detectRetina: true
  };

  constructor() {
  }

  particlesLoaded(container: Container): void {
    // Credits to :  https://github.com/matteobruni
    setTimeout(async () => {
      container.refresh();
    }, 500);
  }

  async particlesInit(main: Engine): Promise<void> {
    await loadFull(main);
  }
}
