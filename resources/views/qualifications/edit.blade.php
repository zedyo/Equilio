@extends('components.layout')

@section('header')
    <h1>Qualifikationen bearbeiten</h1>
@endsection

@section('content')
    <div>
        <p>{{ $qualification->id }}</p>
        <form action="{{ route('qualifications.update', ['qualification' => $qualification]) }}" method="post">
            @method('PUT')
            @csrf

            <div class="form-group">
                <label>
                    <input type="text" class="form-control border-rounded" name="description" value="{{ $qualification->description }}">
                </label>
                <button type="submit">SAVE</button>
            </div>
        </form>
    </div>
@endsection
