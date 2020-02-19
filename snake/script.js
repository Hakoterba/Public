window.onload = function() 
{
    var canvasWidth = 900; 
    var canvasHeight = 600;
    var blocksize = 30;
    var ctx;
    var delay = 100;
    var snaki;
    var pomme;
    var widthinBlocks = canvasWidth / blocksize;
    var heightinBlocks = canvasHeight / blocksize;
    var score;
    var timeout;

    init();

    function init()
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = '30px solid grey';
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas) 
        ctx = canvas.getContext('2d'); 
        snaki = new Snake([[6,4], [5,4], [4,4]],"right");
        pomme = new apple([10,10]);
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas()
    {
        snaki.advance();
        if(snaki.checkCollision())
        {
            GameOver();
        }
        else
        {
            if(snaki.isEatingApple(pomme))
            {
                score++;
                snaki.ateApple = true;
                do
                {
                    pomme.setNewPosition();
                }
                while(pomme.isOnSnake(snaki))
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snaki.draw();
            pomme.draw();
            timeout = setTimeout(refreshCanvas,delay);  
        }

    }
    function GameOver()
    {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = "5";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.strokeText("Game Over",centreX,centreY - 180);
        ctx.fillText("Game Over",centreX,centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeStyle = "white";
        ctx.lineWidth = "5";
        ctx.strokeText("Appuyez sur la touche espace pour rejouer",centreX,centreY - 120);
        ctx.fillText("Appuyez sur la touche espace pour rejouer",centreX,centreY - 120);
        ctx.restore();
    }

    function restart()
    {
        snaki = new Snake([[6,4], [5,4], [4,4]],"right"); 
        pomme = new apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "grey";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.fillText(score.toString(),centreX,centreY);
        ctx.restore();   
    }

    function drawBlock(ctx,position) 
    {
        var x = position[0] * blocksize;
        var y = position[1] * blocksize;
        ctx.fillRect(x,y,blocksize,blocksize);
    }

    function Snake(body,direction) 
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000"; 
            for(var i = 0; i < this.body.length ; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice(); 
            switch(this.direction) 
            {
                case "left":
                    nextPosition[0]--;
                    break;
                case "right":
                    nextPosition[0]++;
                    break;
                case "down":
                    nextPosition[1]++;
                    break;
                case "up":
                    nextPosition[1]--;
                    break;
                default:
                    throw("Invalid direction"); 
            }
            this.body.unshift(nextPosition); 
            if(!this.ateApple) 
                this.body.pop(); 
            else
                this.ateApple = false;
        };
        this.setDirection = function(newDirection)
        {
            var allowedDirections; 
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left","right"];
                    break;      
                default:
                    throw("Invalid direction");          
            }
            if(allowedDirections.indexOf(newDirection) > -1) 
            {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function()
        {
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1); 
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthinBlocks - 1;
            var maxY = heightinBlocks - 1;
            var isnotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isnotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isnotBetweenHorizontalWalls || isnotBetweenVerticalWalls)
            {
                wallCollision = true;
            }

            for(var i = 0; i < rest.length; i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        this.isEatingApple = function(appleToEat)
        {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]) 
            {
                return true;
            }
            else
                return false;
        }
    }

    function apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath()
            var radius = blocksize / 2;
            var x = this.position[0]*blocksize + radius;
            var y = this.position[1]*blocksize + radius;
            ctx.arc(x,y,radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random() * (widthinBlocks - 1)); 
            var newY = Math.round(Math.random() * (heightinBlocks - 1));
            this.position = [newX,newY];
        };
        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false;

            for(var i = 0; i < snakeToCheck.body.length; i++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
    }

    document.onkeydown = function handleKeydown(e) 
    {   
        var key = e.keyCode;
        var newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return; 
        }
        snaki.setDirection(newDirection);
    }
}