import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import certificationsData from '../data/certifications.json';

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credlyUrl?: string;
}

@Component({
  selector: 'app-certifications',
  imports: [CommonModule],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
})
export class Certifications {
  certifications: Certification[] = certificationsData as Certification[];
}
