<template>
  <div class="fields background">
    <div class="field players-field" ref="playersField">
      <h4 class="titles">Поле игрока</h4>

      <div class="flex-container">
        <div class="cards">
          <PlayCard
            class="available cursor"
            :message="playersQueueMessage"
            @click="playerQueueClick"
            :disabled="disabledPlayerQueue"
            :cardImage="queueImage"
          />
        </div>

        <div class="cards">
          <PlayCard @click="next" :cardImage="playerImage[0]" />

          <br />

          <PlayCard @click="next" :cardImage="playerImage[1]" />

          <br />

          <PlayCard @click="next" :cardImage="playerImage[2]" />
        </div>
      </div>
    </div>

    <div class="field common-field">
      <h4 class="titles">
        {{ msg }}
      </h4>

      <label for="input" class="label">лимит штрафных очков</label>

      <input
        class="label cursor input"
        name="input"
        type="number"
        min="1"
        max="10"
        v-model="inputPenaltiValue"
      />

      <br />

      <button class="button cursor" @click="start"></button>

      <div class="common-flex">
        <PlayCard class="common-card" :cardImage="commonImage" />
      </div>

      <h6 class="titles">штрафные очки</h6>

      <h3 class="titles">{{ playersPenaltyPoints }} : {{ aiPenaltyPoints }}</h3>

      <h4 class="endMsg">{{ endMsg }}</h4>
    </div>

    <div class="field ai-field" ref="aiField">
      <h4 class="titles">Поле соперника</h4>

      <div class="flex-container">
        <div class="cards">
          <PlayCard
            class="available cursor"
            @click="choice(0)"
            :disabled="disabledAiCards"
            :cardImage="aiImage[0]"
          />

          <br />

          <PlayCard
            class="available cursor"
            @click="choice(1)"
            :disabled="disabledAiCards"
            :cardImage="aiImage[1]"
          />

          <br />

          <PlayCard
            class="available cursor"
            @click="choice(2)"
            :disabled="disabledAiCards"
            :cardImage="aiImage[2]"
          />
        </div>

        <div class="cards">
          <PlayCard :message="aiQueueMessage" :cardImage="queueImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineFirstStep, shuffle, checkIdentity } from "./Logic";
import { defineComponent } from "vue";
import PlayCard from "./PlayCard.vue";
import PlayQueue from "./PlayQueue.vue";

export default defineComponent({
  name: "MainFields",

  data() {
    return {
      queueImage: "../card.jpg",
      playerImage: ["../card.jpg", "../card.jpg", "../card.jpg"],
      aiImage: ["../card.jpg", "../card.jpg", "../card.jpg"],
      cardImages: [
        "../image0.png",
        "../image1.png",
        "../image2.png",
        "../image3.png",
        "../image4.png",
      ],
      commonImage: "../card.jpg",
      inputPenaltiValue: 1,
      zeroCounter: 4,
      fourCounter: 4,
      msg: "Ход",
      endMsg: "",
      isAnyCardToStrike: false,
      playersPenaltyPoints: 0,
      aiPenaltyPoints: 0,
      commonCard: -1,
      aiQueueMessage: "Карт в очереди 20",
      aiCards: [-1, -1, -1] as Array<number>,
      aiQueue: [] as Array<number>,
      playerQueue: [] as Array<number>,
      playerCards: [-1, -1, -1] as Array<number>,
      playersQueueMessage: "Карт в очереди 20",
      disabledPlayerQueue: true,
      disabledAiCards: true,
    };
  },
  components: {
    PlayCard: PlayCard,
  },

  methods: {
    start: function () {
      (this.$refs.playersField as any).style.backgroundColor = "blue";
      (this.$refs.aiField as any).style.backgroundColor = "blue";
      const temp1 = [
        0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
      ];
      const temp2 = [
        0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
      ];
      this.resetCommonCard();
      this.aiQueue = shuffle(temp1);
      this.playerQueue = shuffle(temp2);
      this.msg = "Ход";
      this.endMsg = "";
      this.zeroCounter = 4;
      this.fourCounter = 4;
      this.aiPenaltyPoints = 0;
      this.playersPenaltyPoints = 0;
      for (let i = 0; i < 3; i++) {
        this.setAiCard(i, this.aiQueue[0]);
        this.setPlayerCard(i, this.playerQueue[0]);
        this.aiQueue.shift();
        this.playerQueue.shift();
      }
      this.aiQueueMessage = "Карт в очереди " + this.aiQueue.length;
      this.playersQueueMessage = "Карт в очереди " + this.playerQueue.length;
      if (defineFirstStep()) {
        this.playersTurn();
      } else {
        this.aiTurn();
      }
    },
    playersTurn: function () {
      this.unblockGame();
      this.msg = "Ход";
      (this.$refs.aiField as any).style.backgroundColor = null;
      (this.$refs.playersField as any).style.backgroundColor =
        "rgba(2, 242, 30, 0.779)";

      this.playerCards.forEach((card, index) => {
        if (this.playerQueue.length != 0) {
          if (card < 0) {
            this.setPlayerCard(index, this.playerQueue[0]);
            this.playerQueue.shift();
          }
        } else {
          this.playersQueueMessage = "Карт в очереди нет";
          this.endMsg = "Вы проиграли";
          this.blockGame();
          return;
        }
      });
      if (this.commonCard >= 0) {
        this.playerQueue.push(this.commonCard);
        this.resetCommonCard();
      }
      this.playersQueueMessage = "Карт в очереди " + this.playerQueue.length;
    },
    playerQueueClick: function () {
      this.msg = "Ход";
      if (this.commonCard >= 0) {
        alert("Необходимо сначала побить карту соперника");
      } else {
        if (this.playerQueue.length != 0) {
          this.setCommonCard(this.playerQueue[0]);
          this.playerQueue.shift();
        } else {
          this.playersQueueMessage = "Карт в очереди нет";
          this.endMsg = "Вы проиграли";
          this.blockGame();
          return;
        }
        this.playersQueueMessage = "Карт в очереди " + this.playerQueue.length;

        this.isAnyCardToStrike = false;
        this.aiCards.forEach((card) => {
          if (card >= 0 && card < this.commonCard) {
            this.isAnyCardToStrike = true;
          }
        });
        if (
          this.commonCard == 0 &&
          this.aiCards.find((card) => card == 4) != undefined
        ) {
          this.isAnyCardToStrike = true;
        }
        if (
          !this.isAnyCardToStrike &&
          checkIdentity(this.commonCard, this.aiCards)
        ) {
          this.isAnyCardToStrike = true;
          this.playerQueue.push(this.commonCard);
          setTimeout(this.resetCommonCard, 1000);
          this.msg = "Попробуйте еще";
          this.playersQueueMessage =
            "Карт в очереди " + this.playerQueue.length;
        }
        if (!this.isAnyCardToStrike) {
          setTimeout(this.aiTurn, 1000);
        }
      }
    },
    choice: function (choice: number) {
      this.msg = "Ход";
      if (this.commonCard >= 0) {
        if (
          (this.aiCards[choice] > -1 &&
            this.commonCard > this.aiCards[choice]) ||
          (this.commonCard == 0 && this.aiCards[choice] == 4)
        ) {
          this.playerQueue.push(this.aiCards[choice], this.commonCard);
          this.playersQueueMessage =
            "Карт в очереди " + this.playerQueue.length;
          this.resetAiCard(choice);
          this.resetCommonCard();
        } else {
          this.msg = "Ошибка";
        }
      } else {
        this.msg = "Сделайте ход";
      }
      if (this.aiCards.find((card) => card >= 0) == undefined) {
        this.aiPenaltyPoints += 1;
        if (this.aiPenaltyPoints >= this.inputPenaltiValue) {
          this.endMsg = "Вы победили";
          this.blockGame();
          return;
        }
        this.aiTurn();
      }
    },
    aiTurn: function () {
      this.blockGame();
      this.msg = "Ход";
      (this.$refs.playersField as any).style.backgroundColor = null;
      (this.$refs.aiField as any).style.backgroundColor =
        "rgba(2, 242, 30, 0.779)";

      this.aiCards.forEach((card, index) => {
        if (this.aiQueue.length != 0) {
          if (card < 0) {
            this.setAiCard(index, this.aiQueue[0]);
            this.checkCardDecrement(this.aiQueue[0]);
            this.aiQueue.shift();
          }
        } else {
          this.aiQueueMessage = "Карт в очереди нет";
          this.endMsg = "Вы победили";
          this.blockGame();
          return;
        }
      });
      if (this.commonCard >= 0) {
        this.aiQueue.push(this.commonCard);
        this.checkCardIncrement(this.commonCard);
        this.resetCommonCard();
      }
      this.aiQueueMessage = "Карт в очереди " + this.aiQueue.length;
      setTimeout(this.aiQueueClick, 500);
    },
    aiQueueClick: function () {
      this.msg = "Ход";
      if (this.aiQueue.length != 0) {
        this.setCommonCard(this.aiQueue[0]);
        this.checkCardDecrement(this.aiQueue[0]);
        this.aiQueue.shift();
      } else {
        this.aiQueueMessage = "Карт в очереди нет";
        this.endMsg = "Вы победили";
        this.blockGame();
        return;
      }
      this.aiQueueMessage = "Карт в очереди " + this.aiQueue.length;
      this.isAnyCardToStrike = false;
      if (
        this.commonCard == 0 &&
        this.playerCards.find((card) => card == 4) != undefined
      ) {
        this.isAnyCardToStrike = true;
      } else {
        this.playerCards.forEach((card) => {
          if (card >= 0 && card < this.commonCard) {
            this.isAnyCardToStrike = true;
          }
        });
      }
      if (
        !this.isAnyCardToStrike &&
        checkIdentity(this.commonCard, this.playerCards)
      ) {
        this.aiQueue.push(this.commonCard);
        this.checkCardIncrement(this.commonCard);
        setTimeout(this.resetCommonCard, 1000);
        this.aiQueueMessage = "Карт в очереди " + this.aiQueue.length;
        setTimeout(this.aiQueueClick, 1500);
        return;
      }
      if (!this.isAnyCardToStrike) {
        setTimeout(this.playersTurn, 1000);
      } else {
        setTimeout(this.next, 1000);
      }
    },
    next: function () {
      this.msg = "Ход";
      const index = this.makeChoice();
      this.aiQueue.push(this.playerCards[index], this.commonCard);
      this.checkCardIncrement(this.playerCards[index]);
      this.checkCardIncrement(this.commonCard);
      this.resetPlayerCard(index);
      this.resetCommonCard();
      this.aiQueueMessage = "Карт в очереди " + this.aiQueue.length;
      let wasPenalty = false;
      if (this.playerCards.find((card) => card >= 0) == undefined) {
        this.playersPenaltyPoints += 1;
        wasPenalty = true;
        if (this.playersPenaltyPoints >= this.inputPenaltiValue) {
          this.endMsg = "Вы проиграли";
          this.blockGame();
          return;
        }
        this.playersTurn();
        return;
      }
      if (!wasPenalty) {
        setTimeout(this.aiQueueClick, 1000);
      }
    },
    makeChoice: function (): number {
      let difference = 5;
      let indexWithMinDifference = -1;
      if (this.commonCard == 0) {
        indexWithMinDifference = this.playerCards.indexOf(4);
      } else {
        this.playerCards.forEach((card, index) => {
          if (card >= 0 && card < this.commonCard) {
            if (difference > this.commonCard - card) {
              difference = this.commonCard - card;
              indexWithMinDifference = index;
            }
          }
        });
        if (
          this.zeroCounter < 3 &&
          this.fourCounter < 3 &&
          this.commonCard < 4 &&
          this.playerCards.find((card) => card == 0) != undefined
        ) {
          indexWithMinDifference = this.playerCards.indexOf(0);
        }
      }

      return indexWithMinDifference;
    },
    setPlayerCard: function (index: number, value: number) {
      this.playerCards[index] = value;
      this.playerImage[index] = this.cardImages[value];
    },
    resetPlayerCard: function (index: number) {
      this.playerCards[index] = -1;
      this.playerImage[index] = "../card.jpg";
    },
    setAiCard: function (index: number, value: number) {
      this.aiCards[index] = value;
      this.aiImage[index] = this.cardImages[value];
    },
    resetAiCard: function (index: number) {
      this.aiCards[index] = -1;
      this.aiImage[index] = "../card.jpg";
    },
    resetCommonCard: function () {
      this.commonCard = -1;
      this.commonImage = "../card.jpg";
    },
    setCommonCard: function (value: number) {
      this.commonCard = value;
      this.commonImage = this.cardImages[value];
    },
    blockGame: function () {
      this.disabledAiCards = true;
      this.disabledPlayerQueue = true;
    },
    unblockGame: function () {
      this.disabledAiCards = false;
      this.disabledPlayerQueue = false;
    },
    checkCardIncrement: function (card: number) {
      if (card == 0) this.zeroCounter++;
      if (card == 4) this.fourCounter++;
    },
    checkCardDecrement: function (card: number) {
      if (card == 0) this.zeroCounter--;
      if (card == 4) this.fourCounter--;
    },
  },
});
</script>

<style>
div * {
  user-select: none;
}
.titles {
  margin: auto;
  margin-bottom: 20px;
  padding: 0px;
  color: rgb(0, 123, 255);
  width: 300px;
  text-align: center;
  vertical-align: middle;
}
.flex-container {
  display: flex;
  justify-content: space-evenly;
}
.common-flex {
  display: flex;
  height: 35%;
  justify-content: center;
}
.cards {
  align-self: center;
}

.common-card {
  align-self: center;
}

.fields {
  height: 100%;
}
.field {
  border: solid 1px red;
  height: 100%;
  font-size: 40px;
}
.players-field {
  flex-grow: 2;
}
.common-field {
  flex-grow: 1;
}
.ai-field {
  flex-grow: 2;
}
.available:hover {
  transition: all 0.5s ease;
  transform: scale(1.1);
}
.label {
  color: rgb(0, 123, 255);
  font-size: 22px;
}
.button {
  width: 205px;
  height: 76px;
  background-image: url(../assets/startButton.png);
  border-radius: 10px;
}
.endMsg {
  margin: 0;
  animation-name: endMsgAnimation;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
.button:active {
  transition: all 0.1s ease;
  transform: scale(0.9);
}
.button:hover {
  transition: all 0.5s ease;
  background-image: url(../assets/startButtonScaled.png);
}
.cursor {
  cursor: pointer;
}
.input {
  opacity: 0.5;
}
@keyframes endMsgAnimation {
  from {
    color: blue;
  }
  50% {
    color: green;
    font-size: 45px;
  }
  to {
    color: red;
  }
}
</style>
