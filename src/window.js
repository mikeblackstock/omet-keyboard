/*eslint-disable no-extra-parens, no-sparse-arrays*/
import {
	h,
	app
} from 'hyperapp';
import {
	Box,
	BoxContainer,
	Button,
	Menubar,
	MenubarItem,
	Toolbar,
	Statusbar,
	TextareaField
} from '@osjs/gui';
import * as ace from 'brace';


import './lilypond';
import 'brace/mode/html';
import 'brace/mode/json';

import 'brace/theme/chrome';
import * as clipboard from 'clipboard-polyfill';
let snippet = {};
let tmpID = '';
let zoomString = '#zoom=100';






const createViewMenu = (state, actions, _) => ([{
	label: _('Log'),
		checked: state.showLog,
		onclick: () => actions.toggleLog(!state.showLog)
	},
	{
	label: _('Tools'),
		checked: state.showTools,
		onclick: () => actions.toggleTools(!state.showTools)
	},	
	{
	label: 'Zoom: page-fit',
		onclick: () => actions.changeZoom('#zoom=page-fit')
	},
	{
	label: 'Zoom: 100',
		onclick: () => actions.changeZoom('#zoom=100')
	},
	{
	label: 'Zoom: 150',
		onclick: () => actions.changeZoom('#zoom=150')
	},


	{
		label: 'Zoom: 200',
		onclick: () => actions.changeZoom('#zoom=200')
	},

	{
		label: 'Show zoom',
		onclick: () => actions.showZoom()
	}

]);



const createEditorInterface = (core, proc, win, $content) => {

	let editor;
 
	const _ = core.make('osjs/locale').translate;
	const vfs = core.make('osjs/vfs');
	const contextmenu = core.make('osjs/contextmenu').show;
	const basic = core.make('osjs/basic-application', proc, win, {

		defaultFilename: 'Default.ly'
	});

	// const setText = contents => editor.setValue(contents); 
	const setText = function(contents, path) {
		editor.setValue(contents);
		editor.navigateFileStart();

		win.setTitle(path);
	};

	const setSavedTitle = function(path) {
		win.setTitle("Saved");
		setTimeout(() => {
			win.setTitle(path);
		}, 1000);
	};
	const {icon} = core.make('osjs/theme');
	const getText = () => editor.getValue();



	const view = (state, actions) => h(Box, {}, [



   	h(Toolbar, {
				style: {
					display: state.showTools ? undefined : 'none'
				} 		
   	}, [
       h(Button, {
        title: 'Octave up',
        label: "'",
  
        onclick: () => actions.insert( "'")
      }),
       h(Button, {
        title: 'Octave down',
        label: ",",
  
        onclick: () => actions.insert( ",")
      }),	 
      h(Button, {
       title: '1',
       label: "1",
//  		icon: icon('go-previous'),
        onclick: () => actions.insert("1")
      }),
      
    
      
      h(Button, {
        title: '2',
        label: "2",
//  		icon: icon('go-next'),  
        onclick: () => actions.insert("2")
      }),
      
           h(Button, {
        title: '4',
       label: "4",
//   		icon: icon('go-up'), 
//        onclick: () => editor.navigateUp(1)
         onclick: () => actions.insert("4")
       }),   
      h(Button, {
        title: '8',
        label: "8",
//    	icon: icon('go-down'),
//        onclick: () => editor.navigateDown(1)
        onclick: () => actions.insert("8")
      }),

      h(Button, {
        title: '16',
        label: "16",
//    	icon: icon('go-down'),
//        onclick: () => editor.navigateDown(1)
        onclick: () => actions.insert("16")
      }),
 
      h(Button, {
        title: '32',
        label: "32",
//    	icon: icon('go-down'),
//        onclick: () => editor.navigateDown(1)
        onclick: () => actions.insert("32")
      }), 
 

      h(Button, {
        title: '.',
        label: ".",
//    	icon: icon('go-down'),
//        onclick: () => editor.navigateDown(1)
        onclick: () => actions.insert(".")
      }),
      
       h(Button, {
        title: 'More',
        label: ">>",
//    	icon: icon('go-down'),
//        onclick: () => editor.navigateDown(1)
        onclick:  (ev) => actions.moreTools(ev)
      }), 
           
      
 ]),


   	h(Toolbar, {
				style: {
					display: state.showTools ? undefined : 'none'
				}
				
   	}, [


       h(Button, {
        title: 'c',
        label: "c",
 
        onclick: () => actions.insert( "c")
      }),
             h(Button, {
        title: 'd',
        label: "d",
  
        onclick: () => actions.insert( "d")
      }),
             h(Button, {
        title: 'e',
        label: "e",
  
        onclick: () => actions.insert( "e")
      }),
             h(Button, {
        title: 'f',
        label: "f",
  
        onclick: () => actions.insert( "f")
      }),	  
             h(Button, {
        title: 'g',
        label: "g",
  
        onclick: () => actions.insert( "g")
      }),	  
             h(Button, {
        title: 'a',
        label: "a",
  
        onclick: () => actions.insert( "a")
      }),	  
             h(Button, {
        title: 'b',
        label: "b",
  
        onclick: () => actions.insert( "b")
      }),	
      
       h(Button, {
        title: 'es',
        label: "es",
  
        onclick: () => actions.insert( "es")
      }),	   
      
        h(Button, {
        title: 'is',
        label: "is",
  
        onclick: () => actions.insert( "is")
      }),
      
        h(Button, {
        title: 'r',
        label: "r",
  
        onclick: () => actions.insert( "r")
      })	 
 ]),
h(Toolbar, {
				style: {
					display: state.showTools ? undefined : 'none'
				}
				
   	}, [
   	

      h(Button, {
        title: 'Space',
        label: "space",
				style: {
					width: "100px",
					display: state.showTools ? undefined : 'none'
				},  
        onclick: () => actions.insert( " ")
      }),
   		h(Button, {
        title: 'Backpace',
        label: "bs",
				style: {
					
					display: state.showTools ? undefined : 'none'
				},  
        onclick: () => actions.backspace()
      }),     
 
 h(Button, {
        title: 'Delete',
        label: "del",
  
        onclick: () => editor.remove()
      }),   
      
      h(Button, {
        title: 'Return ((Newline)',
        label: "ret",
  
        onclick: () => actions.insert("\n")
        
      }),
            h(Button, {
        title: 'Undo',
//        label: "<",
  		icon: icon('edit-undo'),
        onclick: () => editor.undo()
      }),
      
      h(Button, {
        title: 'Redo',
//        label: "<",
  		icon: icon('edit-redo'),
        onclick: () => editor.redo()
      }),
 ]),

		h(Statusbar, {}, [
			h('span', {}, '')
		])
	]);



	const hyperapp = app({
		theme: 'ace/theme/chrome',
		mode: 'ace/mode/lilypond',
		row: 0,
		column: 0,
		lines: 0,
		buttons:'',
		showTools: true,
        selectionRange: "",
        beginSelect: {},
        endSelect: {},
		log: '',
		showLog: false
	}, {

		insert: (token) => {
			core.broadcast('Sandbox', 'Insert', token);
			//			editor.insert(token);
			//			editor.focus();
				},
		backspace: () => {
			core.broadcast('Sandbox', 'Command', 'editor.navigateLeft(1)');	
			core.broadcast('Sandbox', 'Command', 'editor.remove()');
		},
		moreTools: (ev) => {

      		contextmenu({
					position: ev.target,
					
 					menu: [{
 
          				label: '64',
          				onclick: () => editor.insert('64')

						},
						
						{
 
          				label: '128',
          				onclick: () => editor.insert('128')
	
						}]	
					
			});
		}
		


	}, view, $content);




	proc.on('attention', (args) => {

	});


	basic.init();
	

	return hyperapp;
};

export const createEditorWindow = (core, proc) =>
	proc.createWindow({
		id: 'KeyboardWindow',
		title: proc.metadata.title.en_EN,
		icon: proc.resource(proc.metadata.icon),
		//a bit bigger

		dimension: {
			width: 360,
			height: 200
		},
		position: 'bottomrleft'
	})
	.on('destroy', () => proc.destroy())
	.render(($content, win) => {
		createEditorInterface(core, proc, win, $content);
	});
