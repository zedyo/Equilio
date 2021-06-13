@extends('components.layout')

@section('header')
    <h1>Qualifikationen erstellen</h1>
@endsection

@section('content')
    <div class="qualifications text-lg text-gray-200">
        <form action="{{ route('qualifications.store') }}" method="POST">
            @csrf

            <div class="form-group">
                <label>
                    <input type="text" class="form-control border-rounded" name="description">
                </label>
                <button type="submit">SAVE</button>
            </div>
        </form>
    </div>
@endsection
