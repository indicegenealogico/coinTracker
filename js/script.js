if (navigator.userAgent.indexOf("IEMobile") >= 0) {
    document.body.className += " iemobile";
    window.onscroll = function() {
        window.scroll(0, 0);
    };
}

function borrarTodo() {
    let text = "Esta acción borrará toda las transacciones en la base de datos. Desea Continuar?\nPresione OK o Cancel.";
    if (confirm(text) == true) {
        localStorage.clear();

    } 
    
}

let dollarUS = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencySign: 'accounting'
});

let rialBR = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    currencySign: 'accounting'
});


var menu = [
    ["Inicio", "index.html", false],
    ["Gastos", "myExpense()", false],
    ["Ingresos", "myIncome()", false],
    ["Reporte", "myReport()", false]
    // ["Setup", "./setup.html", false]
];

function menuList(active, type, style) {
    var active = typeof active !== 'undefined' ? active : 'Home';
    var html = '<ul';
    html += ' class="' + type + '" style="'+ style + '">';
    for (var i = 0; i < menu.length; i++) {
        html += '<li';
        if (menu[i][0] == active) {
            html += ' class="selected"';
        }
        if (menu[i][0] == 'Home'){
            html += '><a href="'+ menu[i][1] +'"';
        } else {
            html += '><a href="javascript:void(0)" onclick="'+ menu[i][1] +'"';}
        if (menu[i][2])
            html += 'onclick="window.open(this.href);return false;"';
        html += '>' + menu[i][0] + '<\/a><\/li>';
    }
    return html + '<\/ul>';
}


function writeHTML(b, d, f, g){
    var a = '<aside class="left col"><header class="header row">Menu</header><nav class="body row scroll-y">',
        c = '</nav><footer class="footer row">Icons go here</footer></aside><main class="right col"><header class="header row"><span>CoinTracker</span></header><nav class="rmm graphite" data-menu-style="" style="padding: 1.2em; max-width: 561.75px;"><div class="toggled-menu"><div class="rmm-toggled" style="display: block;"><div class="rmm-toggled-controls"><div class="rmm-toggled-title" onclick="closeMenu()">CoinTracker</div><div id="rmm-button" class="rmm-button" onclick="showMenu()"><span>&nbsp;</span><span>&nbsp;</span><span>&nbsp;</span></div></div></div><div id="toggle-menu" class="hidden">',
        e = '</div></div><div class="top-menu" style="padding: 1.2 em; max-width: 561.75px;">';

    var h = a + b + c + d + e + f + g;
    document.body.innerHTML = h;
}

function myReport() {
    var b = menuList('Reports', 'listview'),
        d = menuList('Reports', 'rmm-toggled', 'z-index:1000'),
        f = menuList('Reports', 'rmm-main-list'),
        g = '</div></nav><section class="body row scroll-y"><h1>Reporte</h1><h2>Registro de Transacciones</h2><form id="transactions-form" role="form"></form><div class="table-responsive"><table class="table table-condensed table-hover"><tr id="transactions-head" class="info"><th>#</th><th>Tipo</th><th>Categoria</th><th>Articulo</th><th>Monto</th><th>Fecha</th><th>Comentarios</th></tr><tbody id="transactions-table"></tbody></table></div></section><footer class="footer row"><span>Some status text here</span><button onclick="borrarTodo()">Borrar Transacciones</button></footer></main>';

    writeHTML(b, d, f, g);

    var Transactions = {

        $table: document.getElementById("transactions-table"),
        $form: document.getElementById("transactions-form"),

        init: function() {
            Transactions.$form.addEventListener("submit", function(event) {}, true);

            // initialize table
            if (window.localStorage.length - 1) {
                var transaction_list = [],
                    i, key;
                for (i = 0; i < window.localStorage.length; i++) {
                    key = window.localStorage.key(i);
                    if (/Transactions:\d+/.test(key)) {
                        //Creating an array using JSON DATA
                        transaction_list.push(JSON.parse(window.localStorage.getItem(key)));
                    }
                }
                if (transaction_list.length) {
                    transaction_list
                        .sort(function(a, b) {
                            return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
                        })
                        .forEach(Transactions.tableAdd);
                }
            }
        },
        //DOM Manipulation
        tableAdd: function(entry) {
            var $tr = document.createElement("tr"),
                $td, key;
            for (key in entry) {
                if (entry.hasOwnProperty(key)) {
                    $td = document.createElement("td"); //Adding an extra <td> to table
                    $td.appendChild(document.createTextNode(entry[key]));
                    $tr.appendChild($td);
                }
            }

            $td = document.createElement("td");
            $tr.appendChild($td);
            $tr.setAttribute("class", "items");
            Transactions.$table.appendChild($tr);
        },

    };
    Transactions.init();
    addTotal();
}

function addTotal() {

    var nth = 5;
    var tds = new Array();
    var table = document.getElementById('transactions-table');
    var trs = parseInt(table.getElementsByTagName('tr').length);

    tds = table.getElementsByTagName('td');
    tdsn = parseInt(tds.length);

    var sum = 0;
    var div = tdsn / trs;

    var x = 0;
    if (trs) {
        for (var i = 0; i < trs; i++) {
            x = nth - 1 + (div) * i;
            sum += isNaN(tds[x].innerHTML) ? 0 : parseFloat(tds[x].innerHTML);
        }

        //Adding a total row to table
        document.getElementById('transactions-table').innerHTML +=
            '<tr><td></td><td></td><td></td><td>Total</td><td>' + rialBR.format(sum) + '</td><td></td><td></td><td></td></tr>';
    }
}

function myIncome() {
    var b = menuList('Incomes', 'listview');
    var d = menuList('Incomes', 'rmm-toggled', 'z-index:1000');
    var f = menuList('Incomes', 'rmm-main-list');
    var g = '</div></nav><section class="body row scroll-y"><h1>INGRESOS</h1><h2>Registro de Transacciones</h2><div class="well"><form id="transactions-form" role="form"><div class="form-group"><select name="select" id="tipo" class="form-control" style="display:none;"><option value="Ingresos">Income</option></select><br><label for="category">Categoria</label><input type="text" class="form-control" id="category" placeholder="categoria" required><br><label for="item">Articulo</label><input type="text" class="form-control" id="item" placeholder="Producto | Servicio"><br><label for="amount">Monto</label><input type="text" class="form-control" id="amount" placeholder="R$" required><br><label for="trans_date">Fecha</label><input type="date" class="form-control" id="trans_date" required><br><label for="note">Comentarios</label><input type="text" class="form-control" id="note" placeholder="comentarios"></div><input type="button" class="btn btn-warning" id="transactions-op-discard" value="Cancelar"><input type="submit" class="btn btn-success" id="transactions-op-save" value="Guardar"><input type="hidden" class="btn btn-primary" id="id_entry" value="0"></form></div><div class="table-responsive"><table class="table table-condensed table-hover"><tr id="transactions-head" class="success"><th>ID</th><th>Tipo</th><th>Categoria</th><th>Articulo</th><th>Monto</th><th>Fecha</th><th>Comentarios</th></tr><tbody id="transactions-table"></tbody></table></div></section><footer class="footer row">Some status text here</footer></main>';

    writeHTML(b, d, f, g);

    //Creating a JavaScript Object
    var Transactions = {
        index: window.localStorage.getItem("Transactions:index"),
        $table: document.getElementById("transactions-table"),
        $form: document.getElementById("transactions-form"),
        $select: document.getElementById("tipo"),
        $button_saveI: document.getElementById("transactions-op-saveI"),
        $button_discard: document.getElementById("transactions-op-discard"),

        init: function() {
            // initialize storage index
            if (!Transactions.index) {
                window.localStorage.setItem("Transactions:index", Transactions.index = 1);
            }
            // initialize form
            Transactions.$form.reset();
            Transactions.$button_discard.addEventListener("click", function(event) {
                Transactions.$form.reset();
                Transactions.$form.id_entry.value = 0;
            }, true);
            Transactions.$form.addEventListener("submit", function(event) {
                var entry = {
                    id: parseInt(this.id_entry.value),
                    tipo: this.tipo.value,
                    category: this.category.value,
                    item: this.item.value,
                    amount: parseInt(this.amount.value).toFixed(2),
                    date: this.trans_date.value,
                    comm: this.note.value,
                    //now: new Date()
                };
                if (entry.id == 0) { // add
                    Transactions.storeAdd(entry);
                    Transactions.tableAdd(entry);
                    // Transactions.SelectAdd(entry);
                } else { // edit
                    Transactions.storeEdit(entry);
                    Transactions.tableEdit(entry);
                }
                this.reset();
                this.id_entry.value = 0;
                event.preventDefault();
            }, true);

            // initialize table
            if (window.localStorage.length - 1) {
                var transaction_list = [],
                    i, key;
                for (i = 0; i < window.localStorage.length; i++) {
                    key = window.localStorage.key(i);
                    if (/Transactions:\d+/.test(key)) {
                        transaction_list.push(JSON.parse(window.localStorage.getItem(key)));
                    }
                }
                if (transaction_list.length) {
                    transaction_list
                        .sort(function(a, b) {
                            return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
                        })
                        .forEach(Transactions.tableAdd);
                }
            }
            Transactions.$table.addEventListener("click", function(event) {
                var op = event.target.getAttribute("data-op");
                if (/edit|remove/.test(op)) {
                    var entry = JSON.parse(window.localStorage.getItem("Transactions:" + event.target.getAttribute("data-id")));
                    if (op == "edit") {
                        // Transactions.$form.tipo.value = entry.tipo;
                        Transactions.$form.category.value = entry.category;
                        Transactions.$form.item.value = entry.item;
                        Transactions.$form.amount.value = entry.amount;
                        Transactions.$form.trans_date.value = entry.date;
                        Transactions.$form.note.value = entry.comm;
                        Transactions.$form.id_entry.value = entry.id;
                    } else if (op == "remove") {
                        if (confirm('Esta seguro de querer eliminar "' + entry.item + ' ' + entry.amount + '" de sus transacciones?')) {
                            Transactions.storeRemove(entry);
                            Transactions.tableRemove(entry);
                        }
                    }
                    event.preventDefault();
                }
            }, true);
        },
        storeAdd: function(entry) {
            entry.id = Transactions.index;
            window.localStorage.setItem("Transactions:index", ++Transactions.index);
            window.localStorage.setItem("Transactions:" + entry.id, JSON.stringify(entry));
        },
        storeEdit: function(entry) {
            window.localStorage.setItem("Transactions:" + entry.id, JSON.stringify(entry));
        },
        storeRemove: function(entry) {
            window.localStorage.removeItem("Transactions:" + entry.id);
        },
        tableAdd: function(entry) {
            if (entry.tipo === 'Ingresos') {
                var $tr = document.createElement("tr"),
                    $td, key;
                for (key in entry) {
                    if (entry.hasOwnProperty(key)) {
                        $td = document.createElement("td");
                        $td.appendChild(document.createTextNode(entry[key]));
                        $tr.appendChild($td);
                    }
                }
                $td = document.createElement("td");
                $td.innerHTML = '<a data-op="edit" data-id="' + entry.id + '">Editar</a> | <a data-op="remove" data-id="' + entry.id + '">Borrar</a>';
                $tr.appendChild($td);
                $tr.setAttribute("id", "entry-" + entry.id);
                //$tr.setAttribute("class", "items");
                Transactions.$table.appendChild($tr);
            }
        },
        tableEdit: function(entry) {
            var $tr = document.getElementById("entry-" + entry.id),
                $td, key;
            $tr.innerHTML = "";
            for (key in entry) {
                if (entry.hasOwnProperty(key)) {
                    $td = document.createElement("td");
                    $td.appendChild(document.createTextNode(entry[key]));
                    $tr.appendChild($td);
                }
            }
            $td = document.createElement("td");
            $td.innerHTML = '<a data-op="edit" data-id="' + entry.id + '">Edit</a> | <a data-op="remove" data-id="' + entry.id + '">Remove</a>';
            $tr.appendChild($td);
        },
        tableRemove: function(entry) {
            Transactions.$table.removeChild(document.getElementById("entry-" + entry.id));
        }
    };
    Transactions.init();
}

function myExpense() {

    var b = menuList('Expenses', 'listview');
    var d = menuList('Expenses', 'rmm-toggled', 'z-index:1000');
    var f = menuList('Expenses', 'rmm-main-list');
    var g = '</div></nav><section class="body row scroll-y"><h1>GASTOS</h1><h2>Registro de Transacciones</h2><div class="well"><form id="transactions-form" role="form"><div class="form-group"><select name="select" id="tipo" class="form-control" style="display:none;"><option value="Gastos">Expense</option></select><br><label for="category">Categoria</label><input type="text" class="form-control" id="category" placeholder="categoria" required><br><label for="item">Item</label><input type="text" class="form-control" id="item" placeholder="Proveedor | Destinatario"><br><label for="amount">Amount</label><input type="text" class="form-control" id="amount" placeholder="R$" required><br><label for="trans_date">Date</label><input type="date" class="form-control" id="trans_date" required><br><label for="note">Comentarios</label><input type="text" class="form-control" id="note" placeholder="comentarios"></div><input type="button" class="btn btn-warning" id="transactions-op-discard" value="Cancelar"><input type="submit" class="btn btn-success" id="transactions-op-save" value="Guardar"><input type="hidden" class="btn btn-primary" id="id_entry" value="0"></form></div><div class="table-responsive"><table class="table table-condensed table-hover"><tr id="transactions-head" class="danger"><th>#</th><th>Tipo</th><th>Categoria</th><th>Item</th><th>Monto</th><th>Fecha</th><th>Comentarios</th></tr><tbody id="transactions-table"></tbody></table></div></section><footer class="footer row">Controla tus gastos</footer></main>';
    
    writeHTML(b, d, f, g);

    var Transactions = {
        index: window.localStorage.getItem("Transactions:index"),
        $table: document.getElementById("transactions-table"),
        $form: document.getElementById("transactions-form"),
        $select: document.getElementById("tipo"),
        $button_save: document.getElementById("transactions-op-save"),
        $button_discard: document.getElementById("transactions-op-discard"),

        init: function() {
            // initialize storage index
            if (!Transactions.index) {
                window.localStorage.setItem("Transactions:index", Transactions.index = 1);
            }
            // initialize form
            Transactions.$form.reset();
            Transactions.$button_discard.addEventListener("click", function(event) {
                Transactions.$form.reset();
                Transactions.$form.id_entry.value = 0;
            }, true);
            Transactions.$form.addEventListener("submit", function(event) {
                var entry = {
                    id: parseInt(this.id_entry.value),
                    tipo: this.tipo.value,
                    category: this.category.value,
                    item: this.item.value,
                    amount: parseInt((this.amount.value) *-1).toFixed(2),
                    date: this.trans_date.value,
                    comm: this.note.value,
                    //now: new Date()
                };
                if (entry.id == 0) { // add
                    Transactions.storeAdd(entry);
                    Transactions.tableAdd(entry);
                    // Transactions.selectAdd(entry);
                } else { // edit
                    Transactions.storeEdit(entry);
                    Transactions.tableEdit(entry);
                }
                this.reset();
                this.id_entry.value = 0;
                event.preventDefault();
            }, true);

            // initialize table
            if (window.localStorage.length - 1) {
                var transaction_list = [],
                    i, key;
                for (i = 0; i < window.localStorage.length; i++) {
                    key = window.localStorage.key(i);
                    if (/Transactions:\d+/.test(key)) {
                        transaction_list.push(JSON.parse(window.localStorage.getItem(key)));
                    }
                }
                if (transaction_list.length) {
                    transaction_list
                        .sort(function(a, b) {
                            return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
                        })
                        .forEach(Transactions.tableAdd);
                }
            }
            Transactions.$table.addEventListener("click", function(event) {
                var op = event.target.getAttribute("data-op");
                if (/edit|remove/.test(op)) {
                    var entry = JSON.parse(window.localStorage.getItem("Transactions:" + event.target.getAttribute("data-id")));
                    if (op == "edit") {
                        Transactions.$form.tipo.value = entry.tipo;
                        Transactions.$form.category.value = entry.category;
                        Transactions.$form.item.value = entry.item;
                        Transactions.$form.amount.value = (entry.amount) * -1;
                        Transactions.$form.trans_date.value = entry.date;
                        Transactions.$form.note.value = entry.comm;
                        Transactions.$form.id_entry.value = entry.id;
                    } else if (op == "remove") {
                        if (confirm('Esta seguro de querer eliminar "' + entry.item + ' ' + entry.amount + '" de sus transacciones?')) {
                            Transactions.storeRemove(entry);
                            Transactions.tableRemove(entry);
                        }
                    }
                    event.preventDefault();
                }
            }, true);
        },
        storeAdd: function(entry) {
            entry.id = Transactions.index;
            window.localStorage.setItem("Transactions:index", ++Transactions.index);
            window.localStorage.setItem("Transactions:" + entry.id, JSON.stringify(entry));
        },
        storeEdit: function(entry) {
            window.localStorage.setItem("Transactions:" + entry.id, JSON.stringify(entry));
        },
        storeRemove: function(entry) {
            window.localStorage.removeItem("Transactions:" + entry.id);
        },
        tableAdd: function(entry) {
            if (entry.tipo === 'Gastos') {
                var $tr = document.createElement("tr"),
                    $td, key;
                for (key in entry) {
                    if (entry.hasOwnProperty(key)) {
                        $td = document.createElement("td");
                        $td.appendChild(document.createTextNode(entry[key]));
                        $tr.appendChild($td);
                    }
                }
                $td = document.createElement("td");
                $td.innerHTML = '<a data-op="edit" data-id="' + entry.id + '">Editar</a> | <a data-op="remove" data-id="' + entry.id + '">Borrar</a>';
                $tr.appendChild($td);
                $tr.setAttribute("id", "entry-" + entry.id);
                //$tr.setAttribute("class", "items");
                Transactions.$table.appendChild($tr);
            }
        },
        tableEdit: function(entry) {
            var $tr = document.getElementById("entry-" + entry.id),
                $td, key;
            $tr.innerHTML = "";
            for (key in entry) {
                if (entry.hasOwnProperty(key)) {
                    $td = document.createElement("td");
                    $td.appendChild(document.createTextNode(entry[key]));
                    $tr.appendChild($td);
                }
            }
            $td = document.createElement("td");
            $td.innerHTML = '<a data-op="edit" data-id="' + entry.id + '">Edit</a> | <a data-op="remove" data-id="' + entry.id + '">Remove</a>';
            $tr.appendChild($td);
        },
        tableRemove: function(entry) {
            Transactions.$table.removeChild(document.getElementById("entry-" + entry.id));
        }
    };
    Transactions.init();
}

function showMenu() {
    document.getElementById("toggle-menu").className="no-hidden";
}
function closeMenu(){
    document.getElementById("toggle-menu").className="hidden";
}
