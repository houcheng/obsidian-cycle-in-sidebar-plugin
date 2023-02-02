import {Plugin, WorkspaceLeaf, WorkspaceSidedock} from 'obsidian';

export default class CycleInSidebarPlugin extends Plugin {
	getLeavesOfSidebar(split: WorkspaceSidedock) {
		const oneSideSplitRoot = split.getRoot()
		const leaves : WorkspaceLeaf[] = []
		this.app.workspace.iterateAllLeaves(l => { leaves.push(l) })
		return leaves
			.filter(l => l.getRoot() === oneSideSplitRoot)
			.filter(l => l.view.getViewType() !== 'empty')
	};

	cycleInSideBar (split: WorkspaceSidedock) {
		const leaves = this.getLeavesOfSidebar(split)
		var currentIndex = 0;
		for (; currentIndex < leaves.length; currentIndex ++) {
			if(leaves[currentIndex].view.containerEl.clientHeight > 0) break;
		}
		if (currentIndex == leaves.length) return;
		const nextIndex = (currentIndex + 1) % leaves.length;
		this.app.workspace.revealLeaf(leaves[nextIndex]);
	}

	async cycleRightSideBar () {
		this.cycleInSideBar(this.app.workspace.rightSplit);
	};
	async cycleLeftSideBar () {
		this.cycleInSideBar(this.app.workspace.leftSplit);
	};


	async onload() {
		this.addCommand({
			id: 'cycle-right-sidebar',
			name: 'Cycle tabs of right sidebar',
			callback: () => { this.cycleRightSideBar() }
		});

		this.addCommand({
			id: 'cycle-left-sidebar',
			name: 'Cycle tabs of left sidebar',
			callback: () => { this.cycleLeftSideBar() }
		});
	}

	onunload() {
	}
}
