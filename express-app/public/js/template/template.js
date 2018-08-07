//template
var at = $('#dataTableTemplate').DataTable({
    buttons: [],
    paging: false,
    dom: 'Bfrtip',
    responsive: true,
    "language": {                             
        "decimal": "",
        "emptyTable": "No existen registros en planilla",   
        "info": "Mostrando del registro _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando 0 registros (ninguno)",
        "infoFiltered": "(Datos filtrados de _MAX_ registros)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Moostrar _MENU_ entradas",
        "loadingRecords": "Cargando...",
        "processing": "Procesando...",
        "search": "Buscar planilla:",
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

$(".go-to-cell").click(function(){
    var id = $(this).data("id");
    var ele = $(`#discountRow-${id}`);
    var w = $(window);
    $(`#templateTabs a[href="#${$(this).data("tab")}"]`).tab('show');
    ele.attr("style", "background-color: yellow");          
    setTimeout(function(){
        if (ele.length){
            $('html,body').animate({scrollTop: ele.offset().top - (w.height()/2)}, 1000 );
        }
    }, 300);
    setTimeout(function(){
        ele.removeAttr("style")
    }, 4000);
});

$(".editable-other-bonus").bind("DOMSubtreeModified", function(){
    updateTemplate($(this).data("id"));
});

function updateTemplate(id){
    var valueSalary = parseFloat($(`#valueSalary-${id}`).html());
    var valueIncrement = parseFloat($(`#valueIncrement-${id}`).html());
    var valueOtherBonus = parseFloat($(`#valueOtherBonus-${id}`).html());
    var valueOtherDiscount = parseFloat($(`#total-${id}`).html());
    var valueAFPDiscount = parseFloat($(`#valueAFPDiscount-${id}`).html());   
    if (isNaN(valueSalary)) valueSalary = 0;
    if (isNaN(valueIncrement)) valueIncrement = 0;
    if (isNaN(valueOtherBonus)) valueOtherBonus = 0;
    if (isNaN(valueOtherDiscount)) valueOtherDiscount = 0;
    if (isNaN(valueAFPDiscount)) valueAFPDiscount = 0;

    var valueTotalGain = valueSalary + valueIncrement + valueOtherBonus;
    var valueTotalDiscount = valueOtherDiscount + valueAFPDiscount;
    var valueLiquidPayable = valueTotalGain - valueTotalDiscount;

    //Total Gain
    $(`#valueTotalGain-${id}`).html(valueTotalGain);
    //Other Discount cell
    $(`#valueOtherDiscount-${id}`).html(valueOtherDiscount);
    //Total Discount cell
    $(`#valueTotalDiscount-${id}`).html(valueTotalDiscount);
    //Liquid payable
    $(`#valueLiquidPayable-${id}`).html(valueLiquidPayable);
}