import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf} from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	leftIndex: number = 0;
	rightIndex: number = 0;

	getLeavesOfSidebar(viewTypeName: string) {
		const oneSideSplitRoot = this.app.workspace.getLeavesOfType(viewTypeName)[0].getRoot()
		const leaves : WorkspaceLeaf[] = []
		this.app.workspace.iterateAllLeaves(l => { leaves.push(l) })
		return leaves
			.filter(l => l.getRoot() === oneSideSplitRoot)
			.filter(l => l.view.getViewType() !== 'empty')
	};
	async cycleRightSideBar () {
		const rightLeaves = this.getLeavesOfSidebar('outline')
		if (this.rightIndex >= rightLeaves.length) this.rightIndex = 0

		// new Notice(rightLeaves[this.rightIndex].view.getViewType())
		this.app.workspace.revealLeaf(rightLeaves[this.rightIndex++])
	};
	async cycleLeftSideBar () {
		const leftLeaves = this.getLeavesOfSidebar('search')
		if (this.leftIndex >= leftLeaves.length) this.leftIndex = 0

		// new Notice(leftLeaves[this.rightIndex].view.getViewType())
		this.app.workspace.revealLeaf(leftLeaves[this.leftIndex++])
	};


	async onload() {
		await this.loadSettings();

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

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
