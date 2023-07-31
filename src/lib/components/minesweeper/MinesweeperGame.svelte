<script lang="ts">
    import { allPositions, newMinesweeper, type Position2D } from "$lib/minesweeper/game-state";

    let gameSize = 10;
    let mineCount = 10;
    let {
        state: gameState,
        toggleFlag,
        reveal,
    } = newMinesweeper("Simple", gameSize, gameSize, mineCount);
</script>

<div class="grid grid-cols-1 auto-cols-min w-max">
    <div class="flex flex-row justify-around">
        <div class="w-min">42</div>
        <div class="w-min">
            {#if $gameState.isWon}
                :D
            {:else if $gameState.isLost}
                ;(
            {:else}
                :)
            {/if}
        </div>
        <div class="w-min">24</div>
    </div>
    <div class="grid game" style:--game-size={gameSize}>
        {#each allPositions(gameSize, gameSize) as { x, y }}
            {#if $gameState.getCellVisibility(x, y) === "hidden"}
                <div
                    class="text-center bg-slate-300 hover:bg-slate-500"
                    on:click={() => reveal(x, y)}
                    on:contextmenu|preventDefault={() => toggleFlag(x, y)}
                    role="button"
                    tabindex="0"
                    on:keypress={() => reveal(x, y)}
                />
            {:else if $gameState.getCellVisibility(x, y) === "flagged"}
                <div
                    class="text-center bg-slate-300 hover:bg-slate-500"
                    on:contextmenu|preventDefault={() => toggleFlag(x, y)}
                    role="button"
                    tabindex="0"
                    on:keypress={() => toggleFlag(x, y)}
                >
                    ?
                </div>
            {:else if $gameState.getCellValue(x, y) === "mine"}
                <div class="text-center bg-red-600">M</div>
            {:else if $gameState.getCellValue(x, y) === "0"}
                <div class="text-center bg-slate-100" />
            {:else}
                <div class="text-center bg-slate-100">
                    {$gameState.getCellValue(x, y)}
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .game {
        grid-template-columns: repeat(var(--game-size), minmax(0, 1fr));
        grid-template-rows: repeat(var(--game-size), minmax(0, 1fr));
    }

    .game div {
        width: 1.5rem;
        height: 1.5rem;
        @apply outline outline-1 -outline-offset-1;
    }
</style>
