<script lang="ts">
  import { onMount } from "svelte";
  import doc from "./assets/Voc_anglais_des_affaires_1.json";
  
  const local_storage_name: string = 'savedPerfs';
  
  let words: Word[] = [];

  const rand = () => Math.floor(Math.random() * words.length);
  let input: HTMLInputElement;

  let state: "find" | "review" = "find";
  let correctAnswer = false;

  const ls = window.localStorage.getItem(local_storage_name);
  if (ls) {
    words = JSON.parse(ls);
  } else {
    doc.forEach((word: any) => {
      if (typeof word !== "string") {
        word.ok = 0;
        word.nok = 0;
        words.push(word);
      }
    });
  }
    
  let randIndex: number = rand();

  type Word = {
    id: string;
    english: string;
    french: string[];
    ok: number;
    nok: number;
  };

  onMount(() => {
    input = document.getElementById("input") as HTMLInputElement;
    input.focus();
  });

  function checkWord(event: any): void {
    if (event.key === "Enter") {
      if (state === "find") {
        correctAnswer = findCorrectness(event.target.value, words[randIndex].french.join(' - '));
        if (correctAnswer) {
          input.style.backgroundColor = '#191';
          words[randIndex].ok++;
        } else {
          input.style.backgroundColor = '#911';
          words[randIndex].nok++;
        }
        window.localStorage.setItem(local_storage_name, JSON.stringify(words));
        state = "review";
      } else {
        input.value = '';
        randIndex = rand();
        input.style.backgroundColor = '#111';
        state = "find";
      }
    }
  }

  function findCorrectness(a: string, b: string): boolean {
    return b.trim().toLowerCase().includes(a.trim().toLowerCase());
  }
</script>

<main>
  <div class="all">
    {#if state === "find"}
      <span class="title">Trouve la définition</span>
    {:else}
      <span class="title">Vérifie la réponse</span>
    {/if}
    <div class="card">
      <span>{words[randIndex].english}</span>
    </div>
    <div>
      <input type="text" id="input" on:keyup={(event) => checkWord(event)} />
    </div>
    {#if state === "review"}
      <div>
        <span>{words[randIndex].french.join(' - ')}</span>
      </div>
    {/if}
  </div>
</main>

<style>
  .title {
    font-size: 18px;
    color: #ddd;
  }

  .card {
    padding: 12px;
    background-color: #333;
    margin-top: 24px;
  }

  #input {
    margin: 24px 0px;
    padding: 6px 3px;
  }
</style>
