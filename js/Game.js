class Game {
    constructor(){}
  
    getState(){
      database.ref('gameState').on("value",function(data){
          gameState = data.val();
      });
    }
    
    update(state){
      database.ref('/').update({
        gameState: state
      });
    }
    
    async start(){
      if(gameState === 0){
        player = new Player();
        var playerCountRef = await database.ref('playerCount').once("value");
        if(playerCountRef.exists()){
          playerCount = playerCountRef.val();
          player.getCount();
        }
        form = new Form()
        form.display();
      }
      var x = width/3;
      var y = height/3;
      var row = [];
      for (var j = 0 ; j < 3; j++)
      {
        for (var i = 0; i < 3; i++){
          var sprite = createSprite(x,y,50,50);
          sprite.shapeColor = rgb(200, 200, 255);
          row.push(sprite);
          x = x+100;
        }
        cells.push(row);
        row=[]
        x = width/3;
        y +=100;
      } 


    }
    
    async play(){
      form.hide();
      
      Player.getCurrentPlayer();
      Player.getPlayerInfo();

      textSize(30);
      fill("red");
      strokeWeight(10);
      textAlign(CENTER, CENTER);
     // text("Current Player: "+ (currentPlayer==1?"O":"X"), width/2, 20);
      if (allPlayers !== undefined) text("Current Player: "+ allPlayers[currentPlayer].name, width/2, 50);

      Player.getSelectionInfo();

      if(selections !== undefined){
        // display background ?
        var rindex =0, cindex=0;
    
        for(var i in selections){
            if (selections[i].C0) this.setImage(selections[i].C0, rindex, 0);
            if (selections[i].C1) this.setImage(selections[i].C1, rindex, 1);
            if (selections[i].C2) this.setImage(selections[i].C2, rindex, 2);
            rindex = rindex + 1 ;    
        }
      }
      if(!gameFinished && currentPlayer == player.index){
          for (var i = 0; i < 3; i++){
            for (var j = 0; j < 3; j++) {
              if (mousePressedOver(cells[i][j])){
                var selectionIndex = "selections/R" + i + "/C" + j;
                var valRef = await database.ref(selectionIndex).once("value");
                
                if (!valRef.exists()) {
                  player.updateSelection(selectionIndex);
                  this.checkGameEnd();
                  if (gameState !== 2){
                    if (currentPlayer==1) 
                      currentPlayer=2; 
                    else if (currentPlayer==2) 
                      currentPlayer=1;

                    Player.updateCurrentPlayer(currentPlayer);
                  }
                  
                  
                }
              }
            }
          }
      }

      drawSprites();
    }

    checkGameEnd() {
      
      Player.getSelectionInfo();
      sel = [[0,0,0], [0,0,0], [0,0,0]];
      if (selections.R0 != undefined) sel[0] = this.convertXO(selections.R0);
      if (selections.R1 != undefined) sel[1] = this.convertXO(selections.R1);
      if (selections.R2 != undefined) sel[2] = this.convertXO(selections.R2);
      
      console.log(sel);
      this.chkIfWinner(1);
      if (winner == undefined) {
        this.chkIfWinner(2);
        if (winner == undefined) {
          var cellsLeft = false;
          for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
              if (sel[i][j] == 0)
                cellsLeft = true;
            }
          }
          if (!cellsLeft) {
            gameState = 2;
            this.update(2);
            winner = "none";
          }
        }
      }
    
    }

    convertXO(row) {
      var newRow = [];
      newRow.push(row.C0==undefined?0:row.C0.val=="O"?1:2);
      newRow.push(row.C1==undefined?0:row.C1.val=="O"?1:2);
      newRow.push(row.C2==undefined?0:row.C2.val=="O"?1:2);
      return newRow;
    }

    chkIfWinner(x) {
      if ((sel[0][0]==x && sel[0][1]==x && sel[0][2]==x)||
      (sel[1][0]==x && sel[1][1]==x && sel[1][2]==x) ||
      (sel[2][0]==x && sel[2][1]==x && sel[2][2]==x) ||
      (sel[0][0]==x && sel[1][0]==x && sel[2][0]==x) ||
      (sel[0][1]==x && sel[1][1]==x && sel[2][1]==x) ||
      (sel[0][2]==x && sel[1][2]==x && sel[2][2]==x) ||
      (sel[0][0]==x && sel[1][1]==x && sel[2][2]==x) ||
      (sel[0][2]==x && sel[1][1]==x && sel[2][0]==x)) {
        gameFinished = true;
        winner = x; 
        gameState = 2;
        this.update(2);
      }
    }

    setImage(sel,rindex, cindex) {
      if (sel && sel.val) {
       // console.log("selection", sel)
        if (sel.val == "O")
          cells[rindex][cindex].addImage(oimg);
        else if (sel.val == "X")
          cells[rindex][cindex].addImage(ximg);
          
        cells[rindex][cindex].scale = 0.1;
      }
    }
}
