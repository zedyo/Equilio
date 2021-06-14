@extends('components.layout')

@section('header')
    <h1>Qualifikationen erstellen</h1>
@endsection

@section('content')
    <div>
        <form action="{{ route('qualifications.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label for="description">Name
                 <input type="text" class="form-control border-rounded" name="description">
                </label>

                <button type="submit">SAVE</button>
            </div>
        </form>
    </div>
@endsection
