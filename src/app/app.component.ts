import {Component, OnInit} from '@angular/core';
import * as cytoscape from 'cytoscape';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


  nodeAddForm = new FormGroup({
    name: new FormControl(''),
  });

  edgeAddForm = new FormGroup({
    source: new FormControl(''),
    target: new FormControl(''),
  });

  dfsOutput: string[] = [];

  stylesheet = [
    {
      selector: 'node',
      style: {
        content: 'data(id)'
      }
    },
    {
      selector: 'edge',
      style: {
        content: 'data(label)',
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        width: 4,
        'line-color': '#ddd',
        'target-arrow-color': '#ddd'
      }
    },
    {
      selector: '.highlighted',
      style: {
        'background-color': '#61bffc',
        'line-color': '#61bffc',
        'target-arrow-color': '#61bffc',
        'transition-property': 'background-color, line-color, target-arrow-color',
        'transition-duration': '0.5s'
      }
    },
  ];

  cy: any;
  dfs: any;
  i: number;

  ngOnInit(): void {
    this.cy = cytoscape({
      container: document.getElementById('cy'),

      boxSelectionEnabled: false,
      autounselectify: true,

      style: this.stylesheet,

      elements: {
        nodes: [
          {data: {id: 'a'}},
          {data: {id: 'b'}},
        ],

        edges: [
          {data: {id: 'ab', weight: 1, source: 'a', target: 'b', label: 'ab'}},
        ]
      },

      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: '#a',
        padding: 300
      }
    });
  }

  public highlightNextEle() {
    if (this.i < this.dfs.path.length) {
      this.dfs.path[this.i].addClass('highlighted');
      this.i++;
      setTimeout(() => {
        this.highlightNextEle();
      }, 1000);
    }
  }

  onStart() {
    this.i = 0;
    // tslint:disable-next-line:only-arrow-functions
    this.dfs = this.cy.elements().dfs('#a', function() {
    }, true);
    this.highlightNextEle();
  }

  onNodeAddFormSubmit() {
    this.cy.add({
        group: 'nodes',
        data: {id: this.nodeAddForm.value.name},
        position: {x: 300, y: 300}
      },
    );
  }

  onEdgeAddFormSubmit() {
    this.cy.add({
        group: 'edges',
        data: {
          id: this.edgeAddForm.value.source + this.edgeAddForm.value.target,
          source: this.edgeAddForm.value.source,
          target: this.edgeAddForm.value.target,
          label: this.edgeAddForm.value.source + this.edgeAddForm.value.target
        }
      }
    );
  }

  onClear() {
    window.location.reload();
  }
}
