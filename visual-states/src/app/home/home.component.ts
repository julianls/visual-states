import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';
import { Machine } from '../core';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isRequesting = false;
  public machines: Machine[] = [];

  constructor(private service: AppDataService, public themeService: ThemeService) { }

  ngOnInit(): void {
    this.service.getMachines().subscribe(result => {
      this.machines = result;
    });
  }

  removeMachine(entry: Machine): void {
      if (!confirm('Do you really want to remove ' + entry.Name)){
        return;
      }

      this.isRequesting = true;
      this.service.deleteMachine(entry.Id)
          .subscribe(delItem => {
              this.machines.splice(this.machines.indexOf(entry), 1);
              this.isRequesting = false;
          });
  }
}
