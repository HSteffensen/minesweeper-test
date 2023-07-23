<script lang="ts">
    import MinesweeperGame, { type GridPosition } from "$lib/minesweeper/gamemodel";

    let gameSize = 10;
    let mineCount = 10;
    let gameModel = MinesweeperGame.new(gameSize, gameSize, mineCount);

    function clickCell(cell: GridPosition) {
        gameModel.revealCell(cell);
        gameModel = gameModel.clone();
    }

    function rightClickCell(cell: GridPosition) {
        gameModel.toggleFlagCell(cell);
        gameModel = gameModel.clone();
    }
</script>

<div class="grid grid-cols-1 auto-cols-min w-max">
    <div class="flex flex-row justify-around">
        <div class="w-min">42</div>
        <div class="w-min">
            {#if gameModel.isWon}
                :D
            {:else if gameModel.isLost}
                ;(
            {:else}
                :)
            {/if}
        </div>
        <div class="w-min">24</div>
    </div>
    <div class="grid game" style:--game-size={gameSize}>
        {#each gameModel.cellsList as gameCell}
            {#if gameCell.val === "hidden"}
                <div
                    class="text-center bg-slate-300 hover:bg-slate-500"
                    on:click={() => clickCell(gameCell.pos)}
                    on:contextmenu|preventDefault={() => rightClickCell(gameCell.pos)}
                    role="button"
                    tabindex="0"
                    on:keypress={() => clickCell(gameCell.pos)}
                />
            {:else if gameCell.val === "flag"}
                <div
                    class="text-center bg-slate-300 hover:bg-slate-500"
                    on:click={() => rightClickCell(gameCell.pos)}
                    on:contextmenu|preventDefault={() => rightClickCell(gameCell.pos)}
                    role="button"
                    tabindex="0"
                    on:keypress={() => rightClickCell(gameCell.pos)}
                >
                    ?
                </div>
            {:else if gameCell.val === "mine"}
                <div class="text-center bg-red-600">M</div>
            {:else if gameCell.val === "0"}
                <div class="text-center bg-slate-100" />
            {:else}
                <div class="text-center bg-slate-100">
                    {gameCell.val}
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
