/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, ALL_TODOS, ACTIVE_TODOS, Utils, COMPLETED_TODOS */
(function (window) {
	'use strict';

	window.TodoFooter = React.createClass({displayName: 'TodoFooter',
		render: function () {
			var activeTodoWord = Utils.pluralize(this.props.count, 'item');
			var clearButton = null;

			if (this.props.completedCount > 0) {
				clearButton = (
					React.DOM.button(
						{id:"clear-completed",
						onClick:this.props.onClearCompleted}, 
						'',"Clear completed (",this.props.completedCount,")",''
					)
				);
			}

			var show = {
				ALL_TODOS: '',
				ACTIVE_TODOS: '',
				COMPLETED_TODOS: ''
			};
			show[this.props.nowShowing] = 'selected';

			return (
				React.DOM.footer( {id:"footer"}, 
					React.DOM.span( {id:"todo-count"}, 
						React.DOM.strong(null, this.props.count),
						' ',activeTodoWord,' ',"left",''
					),
					React.DOM.ul( {id:"filters"}, 
						React.DOM.li(null, 
							React.DOM.a( {href:"#/", className:show[ALL_TODOS]}, "All")
						),
						' ',
						React.DOM.li(null, 
							React.DOM.a( {href:"#/active", className:show[ACTIVE_TODOS]}, "Active")
						),
						' ',
						React.DOM.li(null, 
							React.DOM.a( {href:"#/completed", className:show[COMPLETED_TODOS]}, "Completed")
						)
					),
					clearButton
				)
			);
		}
	});
})(window);
