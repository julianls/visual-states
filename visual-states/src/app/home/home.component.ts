import { Component, OnInit } from '@angular/core';
import { AppDataService } from '../app-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public description = '';

  constructor(private service: AppDataService) { }

  ngOnInit(): void {
    this.service.getMachines().subscribe(result => {
      this.description = result.text;
    });
  }

}
