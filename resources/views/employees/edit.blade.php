@extends('components.layout')

@section('header')
    <h1>Angestellten bearbeiten</h1>
@endsection

@section('content')
    <div>
        <p>{{ $employee->id }}</p>
        <form action="{{ route('employees.update', ['employee' => $employee]) }}" method="post">
            @method('PUT')
            @csrf

            <div class="form-group">
                <label for="first_name">Vorname
                    <input type="text" class="form-control border-rounded" name="first_name" value="{{ $employee->first_name }}">
                </label>
                <label for="last_name">Nachname
                    <input type="text" class="form-control border-rounded" name="last_name" value="{{ $employee->last_name }}">
                </label>
                <label for="qualification_id">Qualification:</label>
                <select name="qualification_id" id="qualification_id">
                    @foreach($qualifications as $qualification)
                        <option name="qualification_id" value="{{$qualification->id}}">{{$qualification->description}}</option>
                    @endforeach
                </select>
                <button type="submit">SAVE</button>
            </div>
        </form>
    </div>
@endsection
