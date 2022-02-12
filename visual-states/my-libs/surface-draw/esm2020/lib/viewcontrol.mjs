export class ViewControl {
    constructor() {
        this.scale = 1.0;
        this.offsetX = 0.0;
        this.offsetY = 0.0;
        this.width = 0.0;
        this.height = 0.0;
        this.switch = false;
    }
    zoomIn() {
        this.scale /= 0.80;
    }
    zoomOut() {
        this.scale *= 0.80;
    }
    translateXPlus() {
        this.offsetX += 25;
    }
    translateXMinus() {
        this.offsetX -= 25;
    }
    translateYPlus() {
        this.offsetY += 25;
    }
    translateYMinus() {
        this.offsetY -= 25;
    }
    invalidate() {
        this.switch = !this.switch;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2NvbnRyb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9zdXJmYWNlLWRyYXcvc3JjL2xpYi92aWV3Y29udHJvbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sV0FBVztJQUF4QjtRQUNTLFVBQUssR0FBRyxHQUFHLENBQUM7UUFDWixZQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ2QsWUFBTyxHQUFHLEdBQUcsQ0FBQztRQUNkLFVBQUssR0FBRyxHQUFHLENBQUM7UUFDWixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2IsV0FBTSxHQUFHLEtBQUssQ0FBQztJQTZCeEIsQ0FBQztJQTNCUSxNQUFNO1FBQ1gsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVNLE9BQU87UUFDWixJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU0sY0FBYztRQUNuQixJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sZUFBZTtRQUNwQixJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sY0FBYztRQUNuQixJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sZUFBZTtRQUNwQixJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU0sVUFBVTtRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzdCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBWaWV3Q29udHJvbCB7XHJcbiAgcHVibGljIHNjYWxlID0gMS4wO1xyXG4gIHB1YmxpYyBvZmZzZXRYID0gMC4wO1xyXG4gIHB1YmxpYyBvZmZzZXRZID0gMC4wO1xyXG4gIHB1YmxpYyB3aWR0aCA9IDAuMDtcclxuICBwdWJsaWMgaGVpZ2h0ID0gMC4wO1xyXG4gIHB1YmxpYyBzd2l0Y2ggPSBmYWxzZTtcclxuXHJcbiAgcHVibGljIHpvb21JbigpOiB2b2lkIHtcclxuICAgIHRoaXMuc2NhbGUgLz0gMC44MDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB6b29tT3V0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5zY2FsZSAqPSAwLjgwO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zbGF0ZVhQbHVzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5vZmZzZXRYICs9IDI1O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHRyYW5zbGF0ZVhNaW51cygpOiB2b2lkIHtcclxuICAgIHRoaXMub2Zmc2V0WCAtPSAyNTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0cmFuc2xhdGVZUGx1cygpOiB2b2lkIHtcclxuICAgIHRoaXMub2Zmc2V0WSArPSAyNTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyB0cmFuc2xhdGVZTWludXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLm9mZnNldFkgLT0gMjU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaW52YWxpZGF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc3dpdGNoID0gIXRoaXMuc3dpdGNoO1xyXG4gIH1cclxufVxyXG4iXX0=