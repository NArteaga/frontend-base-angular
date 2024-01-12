export const tipoBitacora = [
  { name: 'SEGUIMIENTO', code: 'SEGUIMIENTO' },
  { name: 'CERRADO', code: 'CERRADO' },
  { name: 'CANCELADO', code: 'CANCELADO' }
]

export const estadoTipoBitacora: any = {
  'SEGUIMIENTO': {
    icon: 'pi pi-clock',
    color: 'warning'
  },
  'CERRADO': {
    icon: 'pi pi-check',
    color: 'success'
  },
  'CANCELADO': {
    icon: 'pi pi-times',
    color: 'danger'
  }
}

export const rowSelect = [
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 20, value: 20 },
  { label: 50, value: 50 }
];
