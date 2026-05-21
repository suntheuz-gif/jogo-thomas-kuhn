const game = {
    players: [
        { id: 1, pos: 0, prestige: 10, name: "Equipa 1", color: '#00e676' },
        { id: 2, pos: 0, prestige: 10, name: "Equipa 2", color: '#ffeb3b' }
    ],
    targetScore: 20,
    turn: 0,
    isAnimating: false,
    
    data: [
        { n: "Início", type: "start", x: 1, y: 1 },
        { n: "C. Normal", type: "normal", x: 1, y: 2 },
        { n: "C. Normal", type: "normal", x: 1, y: 3 },
        { n: "C. Normal", type: "normal", x: 1, y: 4 },
        { n: "Anomalia", type: "anomalia", x: 1, y: 5 },
        { n: "C. Normal", type: "normal", x: 1, y: 6 },
        { n: "C. Normal", type: "normal", x: 1, y: 7 },
        { n: "C. Normal", type: "normal", x: 1, y: 8 },
        { n: "Crise", type: "crise", x: 2, y: 8 },
        { n: "C. Normal", type: "normal", x: 3, y: 8 },
        { n: "Anomalia", type: "anomalia", x: 4, y: 8 },
        { n: "Crise", type: "crise", x: 5, y: 8 },
        { n: "Revolução", type: "revolucao", x: 6, y: 8 },
        { n: "C. Normal", type: "normal", x: 6, y: 7 },
        { n: "C. Normal", type: "normal", x: 6, y: 6 },
        { n: "Anomalia", type: "anomalia", x: 6, y: 5 },
        { n: "C. Normal", type: "normal", x: 6, y: 4 },
        { n: "Crise", type: "crise", x: 6, y: 3 },
        { n: "C. Normal", type: "normal", x: 6, y: 2 },
        { n: "Anomalia", type: "anomalia", x: 6, y: 1 },
        { n: "C. Normal", type: "normal", x: 5, y: 1 },
        { n: "Crise", type: "crise", x: 4, y: 1 },
        { n: "Revolução", type: "revolucao", x: 3, y: 1 },
        { n: "Novo Paradigma", type: "end", x: 2, y: 1 }
    ],

    start() {
        this.players[0].name = document.getElementById('p1-name').value;
        this.players[1].name = document.getElementById('p2-name').value;
        this.targetScore = parseInt(document.getElementById('max-score').value) || 20;
        document.getElementById('tutorial-modal').style.display = 'none';
        this.render();
    },

    async play() {
        if(this.isAnimating) return;
        this.isAnimating = true;
        
        let roll = 0;
        for(let i=0; i<10; i++) {
            roll = Math.floor(Math.random() * 6) + 1;
            document.getElementById('center-dice').innerText = roll;
            await new Promise(r => setTimeout(r, 50));
        }

        await this.movePlayer(roll);
        this.isAnimating = false;
    },

    async movePlayer(steps) {
        let p = this.players[this.turn];
        for(let i=0; i<steps; i++) {
            if(p.pos >= this.data.length - 1) break;
            p.pos++;
            this.render();
            await new Promise(r => setTimeout(r, 300));
        }
        this.applyRules(p, this.data[p.pos]);
        this.turn = (this.turn + 1) % this.players.length;
        this.render();
    },

    applyRules(p, casa) {
        let log = document.getElementById('event-log');
        if(casa.type === 'normal') p.prestige += 1;
        if(casa.type === 'anomalia') p.prestige -= 2;
        if(casa.type === 'crise') { p.pos = Math.max(0, p.pos - 3); p.prestige -= 3; }
        
        if(p.prestige >= this.targetScore) log.innerHTML = `🏆 ${p.name} atingiu o Novo Paradigma!`;
        else if(p.prestige <= 0) { p.prestige = 10; p.pos = 0; log.innerHTML = "Colapso! Recuam ao início."; }
        else log.innerHTML = `${p.name} investigando...`;
    },

    render() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        this.data.forEach((c, i) => {
            const div = document.createElement('div');
            div.className = `cell ${c.type}`;
            div.style.gridRow = c.x; div.style.gridColumn = c.y;
            div.innerHTML = `<span>${c.n}</span><div id="tokens-${i}"></div>`;
            board.appendChild(div);
        });

        this.players.forEach(p => {
            const el = document.getElementById(`tokens-${p.pos}`);
            if(el) el.innerHTML += `<div style="width:10px;height:10px;border-radius:50%;background:${p.color}"></div>`;
        });

        document.getElementById('p1-score').innerText = `${this.players[0].name}: ${this.players[0].prestige}`;
        document.getElementById('p2-score').innerText = `${this.players[1].name}: ${this.players[1].prestige}`;
    }
};