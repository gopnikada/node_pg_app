$(document).ready(function (){
    $('.delete-recipe').on('click', function (){
        let id = $(this).data('id')
        console.log(1)
        let url = '/delete/'+id
        if(confirm('Delete recipe?')){
            console.log(2)
            $.ajax({
                url:url,
                type:'DELETE',

                success: (result)=>{
                    console.log('deleting recipe...')
                    window.location.href='/'
                },
                error: err=>console.error(err)
            })
            console.log(3)
        }
    })
    $('.edit-recipe').on('click', function (){
        $('#edit-form-name').val($(this).data('name'))
        $('#edit-form-ingredients').val($(this).data('ingredients'))
        $('#edit-form-directions').val($(this).data('directions'))
        $('#edit-form-id').val($(this).data('id'))

    })
})