<script lang="ts">
    import MinesweeperGame from "./MinesweeperGame.svelte";

    let width = 10;
    let height = 10;
    let mineCount = 10;
    let resetGame: (width: number, height: number, mineCount: number) => void;
</script>

<div class="grid grid-cols-1">
    <div class="flow">
        <input type="number" bind:value={width} />
        <input type="number" bind:value={height} />
        <input type="number" bind:value={mineCount} />
        <button class="bg-red-300" on:click={() => resetGame(width, height, mineCount)}>
            Restart
        </button>
    </div>
    <MinesweeperGame bind:resetGame />
</div>
