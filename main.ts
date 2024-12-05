import {Plugin, WorkspaceLeaf, WorkspaceSidedock} from 'obsidian';

export default class CycleInSidebarPlugin extends Plugin {
	getLeavesOfSidebar(split: WorkspaceSidedock) {
		const oneSideSplitRoot = split.getRoot()
		const leaves : WorkspaceLeaf[] = []
		this.app.workspace.iterateAllLeaves(l => { leaves.push(l) })
		const leavesInOneSide = leaves
			.filter(l => l.getRoot() === oneSideSplitRoot)
			.filter(l => l.view.getViewType() !== 'empty');
		if (leavesInOneSide.length == 0) return leaves;

		// filter only first container (if top/ bottom views)
		const parent = leavesInOneSide[0].parent
		return leavesInOneSide.filter(l => l.parent == parent);
	}

	isSidebarOpen (split: WorkspaceSidedock) {
		return this.getLeavesOfSidebar(split).some(l => l.view.containerEl.clientHeight > 0)
	}
	cycleInSideBar (split: WorkspaceSidedock, offset: number) {
		const leaves = this.getLeavesOfSidebar(split)
		var currentIndex = 0;
		for (currentIndex = 0; currentIndex < leaves.length; currentIndex++) {
			if (leaves[currentIndex].view.containerEl.clientHeight > 0) break;
		}
		if (currentIndex == leaves.length) return;
		const nextIndex = ((currentIndex + offset) < 0 ? (leaves.length - 1) : (currentIndex + offset)) % leaves.length;
		this.app.workspace.revealLeaf(leaves[nextIndex]);
	}

	async cycleRightSideBar (offset: number) {
		this.cycleInSideBar(this.app.workspace.rightSplit, offset);

	}
	async cycleLeftSideBar (offset: number) {
		this.cycleInSideBar(this.app.workspace.leftSplit, offset);
	}


	async onload() {
		this.addCommand({
			id: 'cycle-right-sidebar',
			name: 'Cycle tabs of right sidebar',
			callback: () => { this.cycleRightSideBar(1) }
		});
		this.addCommand({
			id: 'cycle-right-sidebar-reverse',
			name: 'Cycle tabs of right sidebar in reverse',
			callback: () => { this.cycleRightSideBar(-1) }
		});

		this.addCommand({
			id: 'cycle-left-sidebar',
			name: 'Cycle tabs of left sidebar',
			callback: () => { this.cycleLeftSideBar(1) }
		});
		this.addCommand({
			id: 'cycle-left-sidebar-reverse',
			name: 'Cycle tabs of left sidebar in reverse',
			callback: () => { this.cycleLeftSideBar(-1) }
		});
	}

	onunload() {
	}
}
