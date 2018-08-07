//admin-teacher
var at = $('#dataTableAdminTeacher').DataTable({
    buttons: [],
    paging: false,
    dom: 'Bfrtip',
    responsive: true,
    "language": {                             
        "decimal": "",
        "emptyTable": "No existen registros en personal docente y administrativo",   
        "info": "Mostrando del registro _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando 0 registros (ninguno)",
        "infoFiltered": "(Datos filtrados de _MAX_ registros)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Moostrar _MENU_ entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar en personal docente y administrativo:",
        "zeroRecords": "No se encontraron registros",
        "paginate": {
            "first": "Primero",
            "last": "Ultimo",
            "next": "Siguiente",
            "previous": "Anterior"
        },
        "aria": {
            "sortAscending": ": ordenar ascendentemente",
            "sortDescending": ": ordenar descendentemente"
        }
    }
});

$(".editable-admin-teacher").bind("DOMSubtreeModified", function(){
    var total = 0;
    var id = $(this).data("id");
    for (i=0; i<7 ; i++){
        var ele = $(`#value${i}-${id}`);
        var value = parseFloat(ele.html());
        if (!isNaN(value)){
            total = total + value;
        }
    }
    $(`#total-${id}`).html(total);
    updateTemplate(id);
});