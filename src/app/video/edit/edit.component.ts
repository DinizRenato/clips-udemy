import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges, OnDestroy {

  @Input() activeClip: IClip | null = null;

  inSubmission: boolean = false;
  showAlert: boolean = false;
  alertColor: string = 'blue'
  alertMsg: string = 'Please wait! Updating clip.'
  @Output() update = new EventEmitter();

  clipId = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  editForm = new FormGroup({
    title: this.title
  })


  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnInit(): void {
    this.modal.register('editClip')
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeClip){
      return
    }

    this.inSubmission = false;
    this.showAlert = false;

    this.clipId.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }
  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  async submit(){

    if (!this.activeClip){
      return
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try it later'
      return
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';

  }

}
