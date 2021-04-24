'use strict';

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

let ticketsList = [
  {
    name: 'Lorem ipsum dolor sit amet',
    description:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ' +
                  'ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco ' +
                  'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in ' +
                  'voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat ' +
                  'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    id: '5987177c-1ff8-4c99-b880-ce1390508c33',
    created: `${ new Date().toLocaleDateString() } ${ new Date().toLocaleTimeString() }`,
    status: 'checked',
  },
];

app.use(koaBody({
  urlencoded: true,
  multipart: true,
  json: true,
}));

app.use(async (ctx, next) => {

  const { method } = ctx.request.query;
  ctx.response.set({ 'Access-Control-Allow-Origin': '*', });

  if (ctx.request.method === 'GET' && method === 'allTickets') {
    ctx.response.status = 291;
    ctx.response.body = ticketsList;
  } else if (ctx.request.method === 'GET' && method === 'ticketById') {
    const { id } = ctx.request.query;
    ticketsList.forEach(element => {
      if (element.id === id) {
        ctx.response.status = 292;
        ctx.response.body = element;
      }
    })
  } else if ( ctx.request.method === 'POST' ) {
    ctx.response.status = 294;
    let ticketsListUpdated = [];
    let isTicket = false;
    for ( let ticket of ticketsList ) {
      if ( ctx.request.body.id === ticket.id) {
        ctx.request.body.status !== "delete" ? ticketsListUpdated.push(ctx.request.body) : false;
        isTicket = true;
      } else {
        ticketsListUpdated.push(ticket);
      }
    }
    if ( !isTicket ) {
      ticketsListUpdated.push(ctx.request.body);
      ticketsList = ticketsListUpdated;
    } else {
      ticketsList = ticketsListUpdated;
    }
    ctx.response.body = ticketsList;
  }
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
