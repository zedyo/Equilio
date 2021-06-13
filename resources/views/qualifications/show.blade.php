@extends('components.layout')

@section('header')
    <h1>Qualifikationen</h1>
@endsection

@section('content')
    <div>
        <div class="qualifications text-lg text-gray-200">
            <p>{{ $qualification->id }}</p>
            <p>{{ $qualification->description }}</p>
            <a href="{{ route('qualifications.edit', ['qualification' => $qualification]) }}">EDIT</a>
        </div>
    </div>
@endsection
