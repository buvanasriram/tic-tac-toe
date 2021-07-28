class Player {
  constructor(){
    this.index = null;
    this.name = null;
  }

  getCount(){
    database.ref('playerCount').on("value",(data)=>{
      playerCount = data.val();
    })
  }

  updateCount(count){
    database.ref('/').update({
      playerCount: count
    });
  }
  static getCurrentPlayer(){
    database.ref('currentPlayer').on("value",(data)=>{
      currentPlayer = data.val();
    })
  }
  static updateCurrentPlayer(count){
    database.ref('/').update({
      currentPlayer: count
    });
  }

  update(){
    var playerIndex = "players/" + this.index;
    database.ref(playerIndex).set({
      name:this.name,
    });
  }
  static getPlayerInfo(){
    database.ref('players').on("value",(data)=>{
      allPlayers = data.val();
    })
  }

  static getSelectionInfo(){
    database.ref('selections').on("value",(data)=>{
      selections = data.val();
    })
  }

  updateSelection(selectionIndex){
    var val = "";
    if (this.index == 1) val= "O";
    if (this.index == 2) val= "X";
    database.ref(selectionIndex).set({
            val : val
    });
  }
}
