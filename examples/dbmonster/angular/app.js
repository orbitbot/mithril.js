var renderStage = 0
perfMonitor.startFPSMonitor()
perfMonitor.startMemMonitor()
perfMonitor.initProfiler("render")

var AppComponent = ng.core.Component({selector: "my-app"})
.View({
	directives: [ng.common.CORE_DIRECTIVES],
	template: "<div>" +
		"<table class='table table-striped latest-data'>" +
			"<tbody>" +
				"<tr *ngFor='let db of databases'>" +
					"<td class='dbname'>{{db.dbname}}</td>" +
					"<td class='query-count'>" +
						"<span [class]='db.lastSample.countClassName'>{{db.lastSample.nbQueries}}</span>" +
					"</td>" +
					"<td *ngFor='let q of db.lastSample.topFiveQueries' [class]='q.elapsedClassName'>" +
						"{{q.formatElapsed}}" +
						"<div class='popover left'>" +
							"<div class='popover-content'>{{q.query}}</div>" +
							"<div class='arrow'></div>" +
						"</div>" +
					"</td>" +
				"</tr>" +
			"</tbody>" +
		"</table>" +
	"</div>"
})
.Class({
	constructor: function() {
		this.databases = []
		this.update()
	},
	update: function() {
		var self = this
		self.databases = ENV.generateData(true).toArray()
		setTimeout(function() {self.update()}, ENV.timeout)
		
		if (renderStage === 0) {
			renderStage = 1
			perfMonitor.startProfile("render")
		}
	},
	ngAfterViewChecked: function() {
		if (renderStage === 1) {
			perfMonitor.endProfile("render")
			renderStage = 0
		}
	},
})

document.addEventListener("DOMContentLoaded", function() {
	ng.core.enableProdMode()
	ng.platform.browser.bootstrap(AppComponent)
})