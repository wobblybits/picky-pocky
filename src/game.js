export default class PickyPocky {
    constructor({ input, assets, libs }) {
      /** Leave most of this stuff - it's to help you! */
      this.input = input;
      this.assets = assets;
      this.libs = libs;
      this.mirco = { round: 0, wins: 0, losses: 0 }
  
      this.state = {
        // defaults
        gameOver: false,
        won: false, // set false = lose by default, true = win by default
      }
    }
  
    /** Create model */
    init(canvas) {
      // Initialize any custom game state
      // const customState = {}
  
      // example:
      const customState = {
        finger: {
          x: -40, //-100,
          y: canvas.height - 80, //200,
          width: 160, //400,
          height: 160, //400,
          angle: 0,
          isTriggered: false,
        },
        noseShift: 0,
        width: canvas.width,
        height: canvas.height,
        nostril: canvas.height / 3,
        belowNostril: canvas.height / 2.25,
        speed: this.mirco.wins + 1,
        totalTime: 0,
        startTime: performance.now(),
        message: "PICKY POCKY",
        hitLeft: false,
        hitRight: false,
        goodShot: false,
        shootSpeed: 18,
      };
  
      // leave this - merges default state with your state
      this.state = { ...this.state, ...customState }
    }
  
    /** logic to update game state */
    update(dt) {
      // this function gets called every tick
      // dt is deltaTime - time between ticks
        const state = this.state;
      /** do stuff with game state here - check for winning and losing! */
      // example
      // if (this.input.isPressedLeft()) {
      //     // Move left
      //   }
      //   if (this.input.isPressedRight()) {
      //     // Move right
      //   }
        if (this.input.isPressedUp()) {
            if (!state.finger.isTriggered) {
            //     console.log(
            //       state.width/2, 
            //       state.finger.x + 48 + (state.finger.height - 150) * Math.sin(state.finger.angle),  
            //       "left " + Math.abs(state.width/2 - 100 - (state.finger.x + 48 + (state.finger.height - 150) * Math.sin(state.finger.angle))),
            //       "right " + Math.abs(state.width/2 + 110 - (state.finger.x + 48 + (state.finger.height - 150) * Math.sin(state.finger.angle)))
            //   );
            //   if (Math.abs(state.width/2 - 100 - (state.finger.x + 48 + (state.finger.height - 150) * Math.sin(state.finger.angle))) < 16) {
            //       state.hitLeft = true;
            //   }
            //   if (Math.abs(state.width/2 + 110 - (state.finger.x + 48 + (state.finger.height - 150) * Math.sin(state.finger.angle))) < 16) {
            //       state.hitRight = true;
            //   }
            if (Math.abs(state.width/2 - 40 - (state.finger.x + 19 + (state.finger.height - 60) * Math.sin(state.finger.angle))) < 16) {
                state.hitLeft = true;
            }
            if (Math.abs(state.width/2 + 44 - (state.finger.x + 19 + (state.finger.height - 60) * Math.sin(state.finger.angle))) < 16) {
                state.hitRight = true;
            }
            }
            state.finger.isTriggered = true;
        }
        
        if (state.finger.isTriggered) {
            if (state.finger.y < state.belowNostril) {
                state.goodShot = state.hitLeft || state.hitRight;
            }
            if (state.finger.y < state.nostril) {
                state.won = state.goodShot;
            }
            else {
                state.finger.x += state.shootSpeed * state.speed * Math.sin(state.finger.angle);
                state.finger.y -= state.shootSpeed * Math.cos(state.finger.angle);
                state.shootSpeed *= .91;
            }
        }
        else {
            state.totalTime += dt * (Math.random() * .5 + .5);
            state.finger.x = state.width/2 + state.width/3 * Math.cos(state.speed*state.totalTime*.0015);
            state.finger.angle = .25 * Math.sin(state.totalTime*.0035);
        }
        
      //   if (this.input.isPressedDown()) {
      //     // Move down
      //   }
      // IMPORTANT: call this method at the end of update()
      this.draw()
    }
  
    /** render visuals based on game state */
    draw() {
      const state = this.state
      const p5 = this.libs.p5 // you can draw with this if you want https://p5js.org/reference/
      /** Render stuff with p5.... */
      p5.noSmooth();
      
      const currentTime = performance.now();
      
      p5.background(0);
      
      p5.push();
          if (state.finger.isTriggered) {
              if (!(state.hitLeft || state.hitRight)) {
                  p5.translate(
                      32 * Math.sin(.005 * currentTime),
                      0
                  );			
              }
              else {
                  p5.translate(
                      0, 
                      16 * Math.sin(.05 * currentTime)
                  );	
              }
          }
      const faceImage = this.assets["face.png"];
      if (faceImage) {
        p5.image(
          faceImage,
          0,
          0,
          state.width,
          state.height,
        );
      }
      p5.pop();
    
      // p5.background(255);
      p5.push();
          p5.imageMode(p5.CENTER);
          p5.translate(
            state.finger.x - state.width/6,
            state.finger.y + 32,
          );
          p5.rotate(state.finger.angle);
      // p5.imageMode(p5.BOTTOM);
        //     p5.image(
        //       this.assets["flower.png"],
        //       0,
        //       0,
        //       160,
        // 160,
        //     );
  
    const fingerImage = this.assets["finger.png"];
    if (fingerImage) {
      p5.image(
        fingerImage,
        state.finger.width / 2,
        state.finger.height / 2,
        state.finger.width,
        state.finger.height,
      );
    }
      p5.pop();
      
      //eyeball expression
    //   if (state.finger.isTriggered) {
    //       p5.push();
    //           p5.fill(0);
    //           p5.rect(
    //               128 + 64 * state.finger.x/state.width - 96 * (!state.hitLeft && !state.hitRight ? .33 : 1) * (.75 - state.finger.y/state.height) + (state.goodShot ? 24 * Math.sin(.0003 * Math.cos(.045 * (currentTime - state.startTime)) * (currentTime - state.startTime)) : 0), 
    //               128 + 16 * (.5 - state.finger.x/state.width) - 64 * (!state.hitLeft && !state.hitRight ? -.5 : 1) * (.75 - state.finger.y/state.height) + (state.goodShot ? 24 * Math.sin(.0007 * Math.sin(.04 * (performance.now() - state.startTime)) * (currentTime - state.startTime)) : 0),
    //               32 + (state.goodShot ? -Math.sin(.004 * (currentTime - state.startTime)) : 0), 
    //               32);
    //           p5.rect(
    //               state.width - 128 - 64 * (1 - state.finger.x/state.width) + 96 * (.75 - (!state.hitLeft && !state.hitRight ? 1.33 : 1) * state.finger.y/state.height) + (state.goodShot ? 24 * Math.sin(.0003 * Math.cos(.04 * (performance.now() - state.startTime)) * (performance.now() - state.startTime)) : 0), 
    //               128 + 16 * state.finger.x/state.width - 64 * (.75 - (!state.hitLeft && !state.hitRight ? .5 : 1) * state.finger.y/state.height) + (state.goodShot ? 24 * Math.sin(.0007 * Math.sin(.04 *  (performance.now() - state.startTime)) * (performance.now() - state.startTime)): 0),
    //               32, 32);
    //       p5.pop();		
    //   }
    //   else {
    //       p5.push();
    //           p5.fill(0);
    //           p5.rect(128 + 64 * state.finger.x/state.width, 128 + 16 * (.5 - state.finger.x/state.width),32,32);
    //           p5.rect(state.width - 128 - 64 * (1 - state.finger.x/state.width),128 + 16 * state.finger.x/state.width,32,32);
    //       p5.pop();	
    //   }
    if (state.finger.isTriggered) {
        p5.push();
            p5.fill(0);
            p5.rect(
                52 + 25 * state.finger.x/state.width - 38.4 * (!state.hitLeft && !state.hitRight ? .33 : 1) * (.75 - state.finger.y/state.height) + (state.goodShot ? 10 * Math.sin(.0003 * Math.cos(.045 * (currentTime - state.startTime)) * (currentTime - state.startTime)) : 0), 
                52 + 6.4 * (.5 - state.finger.x/state.width) - 25.6 * (!state.hitLeft && !state.hitRight ? -.5 : 1) * (.75 - state.finger.y/state.height) + (state.goodShot ? 10 * Math.sin(.0007 * Math.sin(.04 * (performance.now() - state.startTime)) * (currentTime - state.startTime)) : 0),
                12.3 + (state.goodShot ? -Math.sin(.004 * (currentTime - state.startTime)) : 0), 
                12.3);
            p5.rect(
                state.width - 52 - 25.6 * (1 - state.finger.x/state.width) + 38.4 * (.75 - (!state.hitLeft && !state.hitRight ? 1.33 : 1) * state.finger.y/state.height) + (state.goodShot ? 10 * Math.sin(.0003 * Math.cos(.04 * (performance.now() - state.startTime)) * (performance.now() - state.startTime)) : 0), 
                52 + 6.4 * state.finger.x/state.width - 25.6 * (.75 - (!state.hitLeft && !state.hitRight ? .5 : 1) * state.finger.y/state.height) + (state.goodShot ? 10 * Math.sin(.0007 * Math.sin(.04 *  (performance.now() - state.startTime)) * (performance.now() - state.startTime)): 0),
                12.3, 12.3);
        p5.pop();		
    }
    else {
        p5.push();
            p5.fill(0);
            p5.rect(52 + 25.6 * state.finger.x/state.width, 52 + 6.4 * (.5 - state.finger.x/state.width),12.3,12.3);
            p5.rect(state.width - 52 - 25.6 * (1 - state.finger.x/state.width), 52 + 6.4 * state.finger.x/state.width,12.3,12.3);
        p5.pop();	
    }
      
      if (state.goodShot) {
          state.noseShift = Math.max(state.noseShift - .1, -6.4);
          state.finger.y -= .1;
      }
      
    if (state.hitLeft || state.hitRight) {
        const noseImage = this.assets["nose.png"];
        if (noseImage) {
          p5.image(
            noseImage,
            0,
            state.noseShift,
            state.width,
            state.height,
          );
        }
      }
    }
  
    /** return true if game is won, false if lost */
    end() {
        console.log(this.state);
        return this.state.won;
    }
  }
  