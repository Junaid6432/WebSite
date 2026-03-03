// Setup Matter.js Physics Engine
document.addEventListener('DOMContentLoaded', () => {
    // Aliases
    const Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Mouse = Matter.Mouse,
        MouseConstraint = Matter.MouseConstraint,
        Events = Matter.Events;

    const engine = Engine.create();
    // Controlled digital gravity
    engine.gravity.x = 0;
    engine.gravity.y = 0.2;

    const container = document.getElementById('physics-container');
    const labelsContainer = document.getElementById('physics-labels');

    // We make Render transparent so the visual is purely DOM based
    const render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: 'transparent',
            showAngleIndicator: false
        }
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Wall boundaries to keep elements inside
    function getWalls() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return [
            Bodies.rectangle(width / 2, height + 50, width, 100, { isStatic: true, render: { visible: false } }), // Floor
            Bodies.rectangle(-50, height / 2, 100, height, { isStatic: true, render: { visible: false } }), // Left
            Bodies.rectangle(width + 50, height / 2, 100, height, { isStatic: true, render: { visible: false } }), // Right
            Bodies.rectangle(width / 2, -100, width, 100, { isStatic: true, render: { visible: false } }) // Ceiling (optional, but keeps tossed items from flying away)
        ];
    }

    let walls = getWalls();
    Composite.add(engine.world, walls);

    // Data for floating entities
    const kpiData = [
        { label: 'Python / SQL', x: window.innerWidth * 0.2, y: 100, w: 160, h: 60, color: 'rgba(0, 240, 255, 0.1)' },
        { label: 'Looker / Tableau', x: window.innerWidth * 0.8, y: 200, w: 180, h: 60, color: 'rgba(0, 136, 255, 0.1)' },
        { label: 'A/B Testing', x: window.innerWidth * 0.5, y: -50, w: 150, h: 60, color: 'rgba(0, 240, 255, 0.1)' },
        { label: 'Predictive Modeling', x: window.innerWidth * 0.7, y: -200, w: 200, h: 60, color: 'rgba(255, 255, 255, 0.05)' }
    ];

    const bodyDOMElements = [];

    kpiData.forEach(data => {
        // Create Physics Body
        const body = Bodies.rectangle(data.x, data.y, data.w, data.h, {
            restitution: 0.8, // Bounciness
            frictionAir: 0.02,
            render: {
                fillStyle: 'transparent' // Invisible in canvas, drawn by DOM
            }
        });

        Composite.add(engine.world, body);

        // Create DOM Element
        const el = document.createElement('div');
        el.className = 'glass-card hover-glow';
        el.style.position = 'absolute';
        el.style.width = data.w + 'px';
        el.style.height = data.h + 'px';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.pointerEvents = 'none'; // Let mouse events pass down to Canvas for Matter.js mouse constraint
        el.style.color = '#fff';
        el.style.fontWeight = '600';
        el.style.fontSize = '14px';
        el.style.textShadow = '0 0 8px rgba(0, 240, 255, 0.4)';
        el.style.transformOrigin = 'center center';

        // Slightly modify CSS from glass-card to fit smaller kpi style
        el.style.padding = '0';
        el.style.margin = '0';
        el.style.background = data.color;

        el.innerText = data.label;

        labelsContainer.appendChild(el);

        bodyDOMElements.push({
            body: body,
            element: el,
            w: data.w,
            h: data.h
        });
    });

    // Add Mouse Interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Sync DOM Elements with Physics Bodies
    Events.on(engine, 'afterUpdate', function () {
        bodyDOMElements.forEach(item => {
            const { x, y } = item.body.position;
            const angle = item.body.angle;
            // Translate the center of the div to the body's position
            // Also apply rotation
            item.element.style.transform = `translate(${x - item.w / 2}px, ${y - item.h / 2}px) rotate(${angle}rad)`;
        });
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        render.canvas.width = window.innerWidth;
        render.canvas.height = window.innerHeight;

        Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: window.innerWidth, y: window.innerHeight }
        });

        // Reposition walls
        Composite.remove(engine.world, walls);
        walls = getWalls();
        Composite.add(engine.world, walls);
    });

});
