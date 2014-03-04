/**
 * @jsx React.DOM
 */
/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React, Utils */
(function (window) {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	window.TodoItem = React.createClass({displayName: 'TodoItem',
		handleSubmit: function () {
			var val = this.state.editText.trim();
			if (val) {
				this.props.onSave(val);
				this.setState({editText: val});
			} else {
				this.props.onDestroy();
			}
			return false;
		},

		handleEdit: function () {
			// react optimizes renders by batching them. This means you can't call
			// parent's `onEdit` (which in this case triggeres a re-render), and
			// immediately manipulate the DOM as if the rendering's over. Put it as a
			// callback. Refer to app.js' `edit` method
			this.props.onEdit(function () {
				var node = this.refs.editField.getDOMNode();
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}.bind(this));
			this.setState({editText: this.props.todo.title});
		},

		handleKeyDown: function (event) {
			if (event.keyCode === ESCAPE_KEY) {
				this.setState({editText: this.props.todo.title});
				this.props.onCancel();
			} else if (event.keyCode === ENTER_KEY) {
				this.handleSubmit();
			}
		},

		handleChange: function (event) {
			this.setState({editText: event.target.value});
		},

		getInitialState: function () {
			return {editText: this.props.todo.title};
		},

		/**
		 * This is a completely optional performance enhancement that you can implement
		 * on any React component. If you were to delete this method the app would still
		 * work correctly (and still be very performant!), we just use it as an example
		 * of how little code it takes to get an order of magnitude performance improvement.
		 */
		shouldComponentUpdate: function (nextProps, nextState) {
			return (
				nextProps.todo.id !== this.props.todo.id ||
				nextProps.todo !== this.props.todo ||
				nextProps.editing !== this.props.editing ||
				nextState.editText !== this.state.editText
			);
		},

		render: function () {
			return (
				React.DOM.li( {className:React.addons.classSet({
					completed: this.props.todo.completed,
					editing: this.props.editing
				})}, 
					React.DOM.div( {className:"view"}, 
						React.DOM.input(
							{className:"toggle",
							type:"checkbox",
							checked:this.props.todo.completed ? 'checked' : null,
							onChange:this.props.onToggle}
						),
						React.DOM.label( {onDoubleClick:this.handleEdit}, 
							this.props.todo.title
						),
						React.DOM.button( {className:"destroy", onClick:this.props.onDestroy} )
					),
					React.DOM.input(
						{ref:"editField",
						className:"edit",
						value:this.state.editText,
						onBlur:this.handleSubmit,
						onChange:this.handleChange,
						onKeyDown:this.handleKeyDown}
					)
				)
			);
		}
	});
})(window);
